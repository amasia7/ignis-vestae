import Phaser from 'phaser';
import { GROUND, W } from '../../config/game.config';
import { FIGHT } from '../../config/balance';
import type { BossCommonData, BossId } from '../../data/bosses';
import type { TextureKey } from '../../art/registry';
import { StateMachine } from '../../core/StateMachine';
import { puff, ringFx } from '../../fx/particles';
import { beep } from '../../fx/audio';
import { shake } from '../../fx/screenShake';
import type { Player } from '../Player';

/**
 * Colori dei telegrafi per tipo di risposta richiesta al giocatore:
 * azzurro = si scavalca col SALTO, oro = si evita con la SCHIVATA,
 * porpora = difficile da evitare, meglio incassare (o parare) lontani.
 */
export const DODGE_TINTS = {
  jump: 0x7fb7ff,
  roll: 0xffd76b,
  tank: 0xc06fd8,
} as const;

/** Ciò che un boss chiede alla scena di combattimento. */
export interface BossHost {
  readonly over: boolean;
  readonly player: Player;
  circHit(x: number, y: number, r: number, dmg: number, kb: number): void;
  rectHit(rx: number, ry: number, rw: number, rh: number, dmg: number, kb: number): void;
  addFlame(x: number): void;
  addSpear(x: number, y: number, vx: number): void;
  addWave(x: number, vx: number): void;
}

/**
 * Base comune dei boss (legacy r. 400-423): posizione, verso, glow, flash,
 * clamp dell'arena. Lo stato vive nella StateMachine condivisa; le soglie
 * temporali restano valutate per frame perché il moltiplicatore di fase 2
 * può cambiare A METÀ stato, come nel legacy.
 */
export abstract class BossBase<TState extends string = string> {
  readonly scene: Phaser.Scene;
  readonly host: BossHost;
  readonly data: BossCommonData;
  readonly id: BossId;
  readonly mhp: number;
  hp: number;
  x: number;
  face = -1;
  cool: number = FIGHT.bossInitialCooldownMs;
  hitDone = false;
  dead = false;
  deadT = 0;
  readonly node: Phaser.GameObjects.Container;
  readonly img: Phaser.GameObjects.Image;
  protected readonly glow: Phaser.GameObjects.Image;
  protected flashT = 0;
  /** Tinta persistente di fase 2 (Palladio); riapplicata dopo il flash. */
  protected tint2: number | null = null;
  protected readonly sm: StateMachine<TState, undefined>;

  constructor(scene: Phaser.Scene, host: BossHost, data: BossCommonData, initial: TState) {
    this.scene = scene;
    this.host = host;
    this.data = data;
    this.id = data.id;
    this.mhp = data.hp;
    this.hp = data.hp;
    this.x = data.spawnX;
    this.sm = new StateMachine<TState, undefined>(initial, {}, undefined);
    this.node = scene.add.container(this.x, GROUND).setDepth(3);
    this.glow = scene.add
      .image(0, -data.textureH * 0.45, 'dot')
      .setScale(16, 11)
      .setTint(0xff5a1e)
      .setAlpha(0)
      .setDepth(0);
    this.img = scene.add.image(0, 0, data.textureKey as TextureKey).setOrigin(0.5, 1);
    this.node.add([this.glow, this.img]);
  }

  get state(): TState {
    return this.sm.state;
  }

  /** Tempo nello stato corrente in ms (l'aT del legacy). */
  get aT(): number {
    return this.sm.time;
  }

  /** Transizione con reset di tempo e flag (l'idioma aT=0/hitDone=false legacy). */
  protected begin(state: TState): void {
    this.sm.set(state);
    this.hitDone = false;
  }

  /** Fase 2 attiva? Rispetta il comparatore del legacy (lt / lte). */
  get phase2Active(): boolean {
    const p2 = this.data.phase2;
    return p2.comparison === 'lt' ? this.hp < p2.hpThreshold : this.hp <= p2.hpThreshold;
  }

  /** Moltiplicatore di velocità corrente (sp del legacy), valutato per frame. */
  get sp(): number {
    return this.phase2Active ? this.data.phase2.speedMult : 1;
  }

  /** Danno effettivo di un colpo: in fase 2 morde più forte. */
  protected dmg(base: number): number {
    return Math.round(base * (this.phase2Active ? this.data.phase2.damageMult : 1));
  }

  /** Hurtbox ancorata a terra, centrata in x. */
  rect(): Phaser.Geom.Rectangle {
    const { w, h } = this.data.hurtbox;
    return new Phaser.Geom.Rectangle(this.x - w / 2, GROUND - h, w, h);
  }

  setGlow(on: boolean, tint?: number): void {
    this.glow.setTint(tint ?? 0xff5a1e);
    this.glow.setAlpha(on ? 0.1 + 0.06 * Math.sin(this.scene.time.now / 90) : 0);
  }

  flash(): void {
    this.flashT = FIGHT.bossFlashMs;
  }

  protected get px(): number {
    return this.host.player.spr.x;
  }

  /** Avanza il tempo nello stato: da chiamare in testa all'update del boss. */
  protected tick(dt: number): void {
    this.sm.update(dt);
  }

  /** Annuncio unico dell'ingresso in fase 2 (solo per i boss che ce l'hanno). */
  private phase2Announced = false;

  protected postUpdate(dt: number): void {
    if (
      !this.phase2Announced &&
      !this.dead &&
      this.phase2Active &&
      this.data.phase2.speedMult < 1
    ) {
      this.phase2Announced = true;
      ringFx(this.scene, this.x, GROUND - this.data.textureH / 2, 0xc06fd8, 5, 480);
      puff(this.scene, this.x, GROUND - this.data.textureH / 2, 0xc06fd8, 24, 90, 520);
      shake(this.scene, 220, 0.013);
      beep(60, 0.9, 'sawtooth', 0.08, -30);
    }
    this.x = Phaser.Math.Clamp(this.x, FIGHT.bossClampMarginX, W - FIGHT.bossClampMarginX);
    this.node.x = this.x;
    this.node.scaleX = this.face;
    if (this.flashT > 0) {
      this.flashT -= dt;
      this.img.setTintFill(0xffe0a0);
    } else this.clearFlash();
  }

  clearFlash(): void {
    this.img.clearTint();
    if (this.tint2 !== null) this.img.setTint(this.tint2);
  }

  /** Pulizia dei telegrafi persistenti alla morte (Cornelia la sovrascrive). */
  clearMarks(): void {}

  abstract update(dt: number): void;
}
