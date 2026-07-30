import Phaser from 'phaser';
import { ABILITIES, PLAYER } from '../config/balance';
import { GROUND } from '../config/game.config';
import { CLASSES, type PlayerClassData } from '../data/classes';
import { RUN } from '../core/RunState';
import { StateMachine } from '../core/StateMachine';
import { Stamina } from '../core/stamina';
import { attackDamage, rollIFrameActive } from '../core/combat';
import { gameEvents } from '../core/EventBus';
import { JumpTimers } from '../input/JumpTimers';
import type { InputManager } from '../input/InputManager';
import { beep } from '../fx/audio';
import { puff } from '../fx/particles';
import { shake } from '../fx/screenShake';
import type { TextureKey } from '../art/registry';
import { PlayerWeapon } from './PlayerWeapon';

export type PlayerStateId =
  'free' | 'roll' | 'attL' | 'attH' | 'guard' | 'heal' | 'cast' | 'smite' | 'hurt';

/** Ciò che il Player chiede alla scena di combattimento. */
export interface CombatHost {
  readonly over: boolean;
  spawnBolt(x: number, y: number, vx: number): void;
  doSmite(player: Player): void;
  onPlayerDeath(): void;
}

export interface AttackBox {
  rect: Phaser.Geom.Rectangle;
  damage: number;
}

const PLAYER_KEYS: readonly TextureKey[] = ['pl0', 'pl1', 'pl2' /* @scaffold:player-key */];

/** Port fedele del Player legacy (r. 255-397): stessi stati, tempi e valori. */
export class Player {
  readonly scene: Phaser.Scene;
  readonly classIdx: number;
  readonly c: PlayerClassData;
  readonly spr: Phaser.Physics.Arcade.Sprite;
  readonly mhp: number;
  hp: number;
  readonly stamina: Stamina;
  readonly mfl: number;
  fl: number;
  readonly abMax: number;
  readonly baseSpeed: number;
  abCd = 0;
  haste = 0;
  inv = 0;
  fireCd = 0;
  face = 1;
  dead = false;
  /** ms di pressione del tasto d'attacco; -1 = nessuna carica in corso. */
  private chargeMs = -1;
  /** true = il colpo corrente ha già registrato l'impatto (hitReg legacy). */
  hitConnected = true;

  private readonly host: CombatHost;
  private readonly sm: StateMachine<PlayerStateId, Player>;
  private readonly jumpTimers = new JumpTimers();
  private readonly weapon: PlayerWeapon;

  constructor(scene: Phaser.Scene, host: CombatHost) {
    this.scene = scene;
    this.host = host;
    this.classIdx = RUN.classIdx;
    const c = CLASSES[this.classIdx];
    if (!c) throw new Error(`Classe inesistente: ${this.classIdx}`);
    this.c = c;
    // benedizioni permanenti della run (segreti e bottini dei custodi)
    this.mhp = c.hp + RUN.buffTotal('maxHp');
    this.hp = this.mhp;
    this.stamina = new Stamina(c.stamina + RUN.buffTotal('stamina'));
    this.baseSpeed = c.speed * (1 + RUN.buffTotal('speedPct') / 100);
    this.mfl = RUN.maxFlasks(c.flasks);
    this.fl = this.mfl;
    this.abMax = c.abilityCooldownMs;

    const key = PLAYER_KEYS[this.classIdx] ?? 'pl0';
    const s = scene.physics.add.sprite(PLAYER.spawnX, GROUND, key).setOrigin(0.5, 1).setDepth(4);
    const body = s.body as Phaser.Physics.Arcade.Body;
    body.setSize(PLAYER.body.w, PLAYER.body.h);
    body.setOffset(PLAYER.body.offsetX, PLAYER.body.offsetY);
    s.setCollideWorldBounds(true);
    s.setDragX(PLAYER.dragX);
    body.maxVelocity.x = this.baseSpeed;
    body.maxVelocity.y = PLAYER.maxVelY;
    this.spr = s;
    this.weapon = new PlayerWeapon(scene, this.classIdx, s.x, s.y);
    this.sm = this.buildStates();
  }

  /* ---- stato ---- */

  private buildStates(): StateMachine<PlayerStateId, Player> {
    const end = (p: Player): void => p.endState();
    return new StateMachine<PlayerStateId, Player>(
      'free',
      {
        roll: {
          onEnter: (p) => p.sm.at(PLAYER.roll.durationMs, end),
        },
        attL: {
          onEnter: (p) => {
            p.sm.at(PLAYER.lightAttack.hitStartMs, () => {
              p.weapon.slashFx(p, 0.75);
              beep(700, 0.07, 'sawtooth', 0.035, -250);
            });
            p.sm.at(PLAYER.lightAttack.durationMs, end);
          },
        },
        attH: {
          onEnter: (p) => {
            p.sm.at(PLAYER.heavyAttack.hitStartMs, () => {
              p.weapon.slashFx(p, 1.1);
              beep(420, 0.12, 'sawtooth', 0.045, -200);
            });
            p.sm.at(PLAYER.heavyAttack.durationMs, end);
          },
        },
        heal: {
          onEnter: (p) => {
            p.sm.at(PLAYER.heal.applyAtMs, () => {
              p.hp = Math.min(p.mhp, p.hp + PLAYER.heal.amount);
              puff(p.scene, p.spr.x, p.spr.y - 40, 0x9fd8ff, 14, 50, 500);
              beep(880, 0.25, 'sine', 0.05, 120);
            });
            p.sm.at(PLAYER.heal.durationMs, end);
          },
        },
        cast: {
          onEnter: (p) => {
            p.sm.at(ABILITIES.cast.applyAtMs, () => {
              p.host.spawnBolt(
                p.spr.x + p.face * ABILITIES.cast.spawnOffsetX,
                p.spr.y + ABILITIES.cast.spawnOffsetY,
                p.face * ABILITIES.cast.boltSpeed,
              );
              beep(620, 0.16, 'sawtooth', 0.05, -260);
            });
            p.sm.at(ABILITIES.cast.durationMs, end);
          },
        },
        smite: {
          onEnter: (p) => {
            p.sm.at(ABILITIES.smite.applyAtMs, () => p.host.doSmite(p));
            p.sm.at(ABILITIES.smite.durationMs, end);
          },
        },
        hurt: {
          onEnter: (p) => p.sm.at(PLAYER.hurt.stunMs, end),
        },
      },
      this,
    );
  }

  private endState(): void {
    this.sm.set('free');
    this.spr.setScale(1, 1);
    this.spr.setRotation(0);
  }

  get state(): PlayerStateId {
    return this.sm.state;
  }

  get timeInState(): number {
    return this.sm.time;
  }

  /** 0..1 durante la carica dell'attacco (per la posa dell'arma). */
  get chargeProgress(): number {
    return this.chargeMs < 0 ? 0 : Math.min(1, this.chargeMs / PLAYER.attackChargeMs);
  }

  get guarding(): boolean {
    return this.sm.is('guard');
  }

  /** mult effettivo: classe × MOLA SALSA × arma in pugno (cambia al volo). */
  get mult(): number {
    return RUN.effectiveMult(this.c.damageMult) * RUN.weaponMult();
  }

  grounded(): boolean {
    return (this.spr.body as Phaser.Physics.Arcade.Body).blocked.down;
  }

  rect(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(this.spr.x - 15, this.spr.y - 60, 30, 60);
  }

  invuln(): boolean {
    return this.inv > 0 || (this.sm.is('roll') && rollIFrameActive(this.sm.time));
  }

  /* ---- azioni ---- */

  private startRoll(): void {
    this.sm.set('roll');
    const s = this.spr;
    (s.body as Phaser.Physics.Arcade.Body).maxVelocity.x = PLAYER.roll.maxVelocity;
    s.setAccelerationX(0);
    s.setVelocityX(this.face * PLAYER.roll.velocity);
    s.setScale(1, PLAYER.roll.squashScaleY);
    beep(160, 0.12, 'triangle', 0.05, -80);
  }

  private useAbility(): void {
    this.abCd = this.abMax;
    if (this.c.ability === 'cast') this.sm.set('cast');
    else if (this.c.ability === 'smite') {
      this.sm.set('smite');
      beep(140, 0.3, 'sawtooth', 0.06, -60);
    } else {
      this.inv = Math.max(this.inv, ABILITIES.haste.invulnMs);
      this.haste = ABILITIES.haste.durationMs;
      puff(this.scene, this.spr.x, this.spr.y - 35, 0x9fb8e8, 16, 60, 500);
      beep(760, 0.4, 'sine', 0.05, 180);
    }
  }

  hurt(damage: number, knockbackX: number): void {
    if (this.invuln() || this.dead || this.host.over) return;
    this.chargeMs = -1;
    this.spr.setRotation(0);
    // parata: il colpo è assorbito dallo scudo finché regge la resistenza
    if (this.sm.is('guard') && this.stamina.trySpend(PLAYER.shield.staminaCostPerBlock)) {
      this.hp -= damage * PLAYER.shield.damageFactor;
      this.inv = PLAYER.shield.blockInvulnMs;
      this.spr.setVelocityX((knockbackX || 0) * 0.4);
      puff(this.scene, this.spr.x + this.face * 16, this.spr.y - 36, 0x9fd0ea, 8, 30, 260);
      beep(520, 0.08, 'square', 0.05, -120);
      gameEvents.emit('player:hurt', { hp: this.hp, maxHp: this.mhp, damage });
      if (this.hp <= 0) {
        this.hp = 0;
        this.dead = true;
        gameEvents.emit('player:death', { classIdx: this.classIdx });
        this.host.onPlayerDeath();
      }
      return;
    }
    this.hp -= damage;
    this.inv = PLAYER.hurt.invulnMs;
    this.sm.set('hurt');
    this.spr.setVelocity(knockbackX || 0, PLAYER.hurt.knockbackY);
    shake(this.scene, PLAYER.hurt.shake.durationMs, PLAYER.hurt.shake.intensity);
    puff(this.scene, this.spr.x, this.spr.y - 40, 0xc04034, 10, 50, 420);
    beep(110, 0.2, 'square', 0.06, -60);
    gameEvents.emit('player:hurt', { hp: this.hp, maxHp: this.mhp, damage });
    if (this.hp <= 0) {
      this.hp = 0;
      this.dead = true;
      gameEvents.emit('player:death', { classIdx: this.classIdx });
      this.host.onPlayerDeath();
    }
  }

  /** Hitbox del colpo corrente, se attiva e non ancora connessa (legacy r. 299-307). */
  attackBox(): AttackBox | null {
    if (this.hitConnected) return null;
    const { x, y } = this.spr;
    const L = PLAYER.lightAttack;
    const H = PLAYER.heavyAttack;
    if (this.sm.is('attL') && this.sm.window(L.hitStartMs, L.hitEndMs)) {
      return {
        rect: new Phaser.Geom.Rectangle(
          this.face > 0 ? x : x - L.box.w,
          y - L.box.h,
          L.box.w,
          L.box.h,
        ),
        damage: attackDamage(L.damage, this.mult),
      };
    }
    if (this.sm.is('attH') && this.sm.window(H.hitStartMs, H.hitEndMs)) {
      return {
        rect: new Phaser.Geom.Rectangle(
          this.face > 0 ? x : x - H.box.w,
          y - H.box.h,
          H.box.w,
          H.box.h,
        ),
        damage: attackDamage(H.damage, this.mult),
      };
    }
    return null;
  }

  registerHit(): void {
    this.hitConnected = true;
  }

  /* ---- update ---- */

  update(dt: number, input: InputManager): void {
    const s = this.spr;
    const body = s.body as Phaser.Physics.Arcade.Body;

    if (this.inv > 0) this.inv -= dt;
    if (this.fireCd > 0) this.fireCd -= dt;
    if (this.abCd > 0) this.abCd -= dt;
    if (this.haste > 0) {
      this.haste -= dt;
      if (Math.random() < 0.3) {
        const p = this.scene.add
          .image(s.x, s.y - 30 - Math.random() * 24, 'dot')
          .setTint(0x9fb8e8)
          .setAlpha(0.5)
          .setDepth(3)
          .setScale(0.9);
        this.scene.tweens.add({
          targets: p,
          alpha: 0,
          y: p.y - 8,
          duration: 260,
          onComplete: () => p.destroy(),
        });
      }
    }

    const g = this.grounded();
    this.jumpTimers.update(dt, g, input.justPressed('JUMP'));
    const spd = this.baseSpeed * (this.haste > 0 ? ABILITIES.haste.speedMult : 1);
    body.maxVelocity.x = this.sm.is('roll') ? PLAYER.roll.maxVelocity : spd;

    if (this.sm.is('free')) {
      const ax = input.moveAxis();
      if (ax !== 0) {
        this.face = ax;
        s.setAccelerationX(ax * PLAYER.accelX);
        s.setFlipX(ax < 0);
      } else s.setAccelerationX(0);

      if (this.jumpTimers.shouldJump) {
        this.jumpTimers.consume();
        s.setVelocityY(PLAYER.jumpVelocity);
        beep(320, 0.08, 'triangle', 0.03, 140);
      }
      if (!input.jumpHeldForCut() && body.velocity.y < PLAYER.jumpCutVelocity)
        s.setVelocityY(PLAYER.jumpCutVelocity);

      // attacco a tasto unico: tap = leggero, tieni premuto = pesante
      if (this.chargeMs >= 0) {
        this.chargeMs += dt;
        if (input.justPressed('ROLL') && this.stamina.canAfford(PLAYER.roll.staminaCost) && g) {
          this.chargeMs = -1; // la schivata annulla la carica
          this.stamina.trySpend(PLAYER.roll.staminaCost);
          this.startRoll();
        } else if (this.chargeMs >= PLAYER.attackChargeMs) {
          this.chargeMs = -1;
          if (this.stamina.trySpend(PLAYER.heavyAttack.staminaCost)) {
            this.hitConnected = false;
            s.setAccelerationX(0);
            this.sm.set('attH');
          }
        } else if (!input.isHeld('ATTACK')) {
          this.chargeMs = -1;
          if (this.stamina.trySpend(PLAYER.lightAttack.staminaCost)) {
            this.hitConnected = false;
            s.setAccelerationX(0);
            this.sm.set('attL');
          }
        }
      } else if (
        input.justPressed('ATTACK') &&
        this.stamina.canAfford(PLAYER.lightAttack.staminaCost)
      ) {
        this.chargeMs = 0;
      } else if (
        input.justPressed('ROLL') &&
        this.stamina.canAfford(PLAYER.roll.staminaCost) &&
        g
      ) {
        this.stamina.trySpend(PLAYER.roll.staminaCost);
        this.startRoll();
      } else if (input.isHeld('SHIELD') && this.c.hasShield && g) {
        s.setAccelerationX(0);
        this.sm.set('guard');
      } else if (input.justPressed('HEAL') && this.fl > 0 && this.hp < this.mhp && g) {
        this.fl--;
        s.setAccelerationX(0);
        this.sm.set('heal');
      } else if (input.justPressed('ABILITY') && this.abCd <= 0) {
        this.useAbility();
      }
    } else {
      s.setAccelerationX(0);
      // la guardia dura finché il tasto resta premuto
      if (this.sm.is('guard') && !input.isHeld('SHIELD')) this.endState();
    }

    // nuova animazione della schivata: capriola completa
    if (this.sm.is('roll'))
      s.setRotation(this.face * (this.sm.time / PLAYER.roll.durationMs) * Math.PI * 2);

    this.sm.update(dt);
    if (this.sm.is('free') || this.sm.is('guard')) this.stamina.regen(dt);
    s.setAlpha(this.inv > 0 && Math.floor(this.scene.time.now / 60) % 2 ? 0.45 : 1);
    this.weapon.pose(this);
  }
}
