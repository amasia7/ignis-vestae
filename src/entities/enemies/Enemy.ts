import Phaser from 'phaser';
import { GROUND } from '../../config/game.config';
import { ENEMIES, type EnemyData, type EnemyId } from '../../data/enemies';
import { StateMachine } from '../../core/StateMachine';
import { puff } from '../../fx/particles';
import { beep } from '../../fx/audio';
import { circHitPlayer } from '../hitTests';
import type { Player } from '../Player';
import type { TextureKey } from '../../art/registry';

type EnemyState = 'idle' | 'chase' | 'windup' | 'strike' | 'dead';

/** Ciò che un nemico chiede alla scena del livello. */
export interface EnemyHost {
  readonly over: boolean;
  readonly player: Player;
  /** Chiamato alla morte del nemico (drop, conteggi). */
  onEnemyDeath(enemy: Enemy): void;
  /** Freccia degli arcieri, diretta verso il player. */
  spawnArrow(x: number, y: number, vx: number, damage: number): void;
}

/**
 * Mini-nemico dei livelli, interprete di EnemyData (stessa forma dei boss:
 * stato + tempo nello stato + windup telegrafato). Può stare a terra o su
 * una piattaforma (groundY) e combattere in mischia o a distanza.
 */
export class Enemy {
  readonly data: EnemyData;
  x: number;
  /** Quota del piano su cui sta (terra o superficie di una piattaforma). */
  readonly groundY: number;
  face = -1;
  hp: number;
  dead = false;
  readonly node: Phaser.GameObjects.Container;
  private readonly img: Phaser.GameObjects.Image;
  private readonly scene: Phaser.Scene;
  private readonly host: EnemyHost;
  private readonly sm: StateMachine<EnemyState, undefined>;
  /** Estremi di pattugliamento per chi sta su una piattaforma. */
  private readonly minX: number;
  private readonly maxX: number;
  private cool = 400;
  private hitDone = false;
  private flashT = 0;
  private deadT = 0;

  constructor(
    scene: Phaser.Scene,
    host: EnemyHost,
    type: EnemyId,
    x: number,
    groundY = GROUND,
    patrolHalfWidth = Number.POSITIVE_INFINITY,
  ) {
    this.scene = scene;
    this.host = host;
    this.data = ENEMIES[type];
    this.x = x;
    this.groundY = groundY;
    this.minX = x - patrolHalfWidth;
    this.maxX = x + patrolHalfWidth;
    this.hp = this.data.hp;
    this.sm = new StateMachine<EnemyState, undefined>('idle', {}, undefined);
    this.node = scene.add.container(x, groundY).setDepth(3);
    this.img = scene.add.image(0, 0, this.data.textureKey as TextureKey).setOrigin(0.5, 1);
    this.node.add(this.img);
  }

  get state(): EnemyState {
    return this.sm.state;
  }

  rect(): Phaser.Geom.Rectangle {
    const { w, h } = this.data.hurtbox;
    return new Phaser.Geom.Rectangle(this.x - w / 2, this.groundY - h, w, h);
  }

  takeDamage(dmg: number): void {
    if (this.dead) return;
    this.hp -= dmg;
    this.flashT = 90;
    // reazione al colpo: arretra e si contrae — il colpo deve "sentirsi"
    const px = this.host.player.spr.x;
    this.x = Math.max(this.minX, Math.min(this.maxX, this.x + (this.x < px ? -7 : 7)));
    this.scene.tweens.add({
      targets: this.img,
      scaleX: 1.12,
      scaleY: 0.86,
      duration: 60,
      yoyo: true,
    });
    puff(this.scene, this.x, this.groundY - this.data.hurtbox.h / 2, 0xffd27a, 6, 40, 260);
    if (this.hp <= 0) {
      this.dead = true;
      this.sm.set('dead');
      beep(220, 0.15, 'square', 0.04, -120);
      puff(this.scene, this.x, this.groundY - 30, this.data.glowTint, 14, 60, 420);
      this.host.onEnemyDeath(this);
    }
  }

  /** Muove clampando agli estremi del proprio piano. */
  private walk(dir: number, dt: number): void {
    this.x = Math.max(
      this.minX,
      Math.min(this.maxX, this.x + (dir * this.data.moveSpeed * dt) / 1000),
    );
  }

  /** @returns false quando il nemico è svanito e va rimosso. */
  update(dt: number): boolean {
    const d = this.data;
    const player = this.host.player;
    const px = player.spr.x;
    this.sm.update(dt);

    if (this.dead) {
      this.deadT += dt;
      this.node.setAlpha(Math.max(0, 1 - this.deadT / 600));
      if (this.deadT > 600) {
        this.node.destroy();
        return false;
      }
      this.updateVisual(dt);
      return true;
    }

    const dist = Math.abs(px - this.x);
    switch (this.sm.state) {
      case 'idle':
        if (dist < d.aggroRange) this.sm.set('chase');
        break;
      case 'chase':
        this.face = px < this.x ? -1 : 1;
        this.cool -= dt;
        if (d.ranged) {
          // arciere: arretra se il player incalza, altrimenti scocca
          if (dist < d.ranged.retreatRange) this.walk(-this.face, dt);
          else if (dist <= d.attackRange && this.cool <= 0) {
            this.sm.set('windup');
            this.hitDone = false;
            beep(120, 0.18, 'sine', 0.03, -20); // corda che si tende
          }
        } else if (dist > d.attackRange) this.walk(this.face, dt);
        else if (this.cool <= 0) {
          this.sm.set('windup');
          this.hitDone = false;
          beep(90, 0.15, 'square', 0.03, -30);
        }
        if (dist > d.aggroRange * 1.6) this.sm.set('idle');
        break;
      case 'windup':
        // telegrafo: trema leggermente
        this.img.x = Math.sin(this.sm.time / 24) * 2;
        if (this.sm.time >= d.windupMs) this.sm.set('strike');
        break;
      case 'strike':
        if (!this.hitDone) {
          this.hitDone = true;
          if (d.ranged) {
            this.host.spawnArrow(
              this.x + this.face * 20,
              this.groundY - 32,
              this.face * d.ranged.arrowSpeed,
              d.ranged.arrowDamage,
            );
            beep(340, 0.09, 'triangle', 0.04, -140);
          } else {
            circHitPlayer(
              player,
              this.host.over,
              this.x + this.face * 18,
              this.groundY - 20,
              d.hit.radius,
              d.hit.damage,
              this.face * d.hit.knockback,
            );
            puff(this.scene, this.x + this.face * 24, this.groundY - 24, d.glowTint, 8, 44, 300);
            beep(150, 0.12, 'square', 0.05, -50);
          }
        }
        if (this.sm.time >= d.recoverMs) {
          this.sm.set('chase');
          this.cool = d.cooldownMs;
        }
        break;
      case 'dead':
        break;
    }

    this.updateVisual(dt);
    return true;
  }

  private updateVisual(dt: number): void {
    this.node.x = this.x;
    this.node.scaleX = this.face;
    this.node.y = this.data.floats
      ? this.groundY + Math.sin(this.scene.time.now / 300 + this.x) * 4
      : this.groundY;
    if (this.sm.state !== 'windup') this.img.x = 0;
    if (this.flashT > 0) {
      this.flashT -= dt;
      this.img.setTintFill(0xffe0a0);
    } else this.img.clearTint();
    if (!this.dead && Math.random() < 0.06)
      puff(this.scene, this.x, this.groundY - this.data.hurtbox.h, this.data.glowTint, 1, 10, 380);
  }
}
