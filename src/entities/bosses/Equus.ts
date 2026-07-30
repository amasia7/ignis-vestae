import type Phaser from 'phaser';
import { GROUND, W } from '../../config/game.config';
import { EQUUS } from '../../data/bosses';
import { puff } from '../../fx/particles';
import { beep } from '../../fx/audio';
import { shake } from '../../fx/screenShake';
import { BossBase, DODGE_TINTS, type BossHost } from './BossBase';

type EquusState = 'idle' | 'charge' | 'rear' | 'fire' | 'wave';

/**
 * BOSS 1: EQUUS OCTOBER — carica / impennata / soffio di fuoco / onda bassa.
 * Port del legacy (r. 425-477) più il rework: l'onda si scavalca SOLO col
 * salto e i telegrafi sono colorati per tipo di risposta (vedi DODGE_TINTS).
 * Primo boss del gioco: NIENTE fase 2.
 */
export class Equus extends BossBase<EquusState> {
  private readonly d = EQUUS;

  constructor(scene: Phaser.Scene, host: BossHost) {
    super(scene, host, EQUUS, 'idle');
  }

  update(dt: number): void {
    const d = this.d;
    const sp = this.sp; // enrage sotto metà vita (r. 432), valutato per frame
    this.tick(dt);
    const px = this.px;
    this.img.rotation = 0;
    this.setGlow(false);

    if (this.state === 'idle') {
      this.face = px < this.x ? -1 : 1;
      this.x += (this.face * d.idle.moveSpeed * dt) / 1000;
      this.cool -= dt;
      if (this.cool <= 0) {
        const dist = Math.abs(px - this.x);
        // r. 441-443: stesso ordine di estrazioni casuali del legacy
        if (dist > d.selector.chargeDistance || Math.random() < d.selector.chargeChance) {
          this.begin('charge');
          beep(70, 0.4, 'sawtooth', 0.06, 20);
        } else if (Math.random() < d.selector.rearChance) this.begin('rear');
        else if (Math.random() < d.wave.chance) this.begin('wave');
        else this.begin('fire');
      }
    } else if (this.state === 'charge') {
      const wu = d.charge.windupMs * sp;
      if (this.aT < wu) {
        this.setGlow(true, DODGE_TINTS.roll);
        if (Math.random() < 0.35)
          puff(this.scene, this.x - this.face * 46, GROUND - 8, 0x8a7d6a, 1, 24, 260);
      } else {
        this.img.rotation = this.face * d.charge.tiltRotation;
        this.x += (this.face * d.charge.speed * dt) / 1000;
        this.host.rectHit(
          this.x - d.charge.hit.w / 2,
          GROUND - d.charge.hit.h,
          d.charge.hit.w,
          d.charge.hit.h,
          this.dmg(d.charge.hit.damage),
          this.face * d.charge.hit.knockback,
        );
        if (Math.random() < 0.7)
          puff(
            this.scene,
            this.x - this.face * 56,
            GROUND - 30 - Math.random() * 40,
            0xff7a2a,
            1,
            20,
            300,
          );
        if (this.x < d.charge.wallStopMargin || this.x > W - d.charge.wallStopMargin) {
          this.begin('idle');
          this.cool = d.charge.cooldownMs * sp;
        }
      }
    } else if (this.state === 'rear') {
      const wu = d.rear.windupMs * sp;
      if (this.aT < wu) {
        this.setGlow(true, DODGE_TINTS.roll);
        // r. 457: -face*0.35 (windupRotation è già -0.35)
        this.img.rotation = this.face * d.rear.windupRotation;
      }
      if (!this.hitDone && this.aT >= wu) {
        this.hitDone = true;
        this.host.circHit(
          this.x + this.face * (d.rear.hit.offsetX ?? 0),
          GROUND + (d.rear.hit.offsetY ?? 0),
          d.rear.hit.radius,
          this.dmg(d.rear.hit.damage),
          this.face * d.rear.hit.knockback,
        );
        shake(this.scene, 160, 0.01);
        puff(
          this.scene,
          this.x + this.face * (d.rear.hit.offsetX ?? 0),
          GROUND + (d.rear.hit.offsetY ?? 0),
          0xd8c9a3,
          18,
          80,
          420,
        );
        beep(90, 0.3, 'square', 0.07, -40);
      }
      if (this.aT >= wu + d.rear.recoverMs) {
        this.begin('idle');
        this.cool = d.rear.cooldownMs * sp;
      }
    } else if (this.state === 'fire') {
      const wu = d.fire.windupMs * sp;
      if (this.aT < wu) this.setGlow(true, DODGE_TINTS.jump);
      if (!this.hitDone && this.aT >= wu) {
        this.hitDone = true;
        for (let i = 1; i <= d.fire.flameCount; i++)
          this.host.addFlame(
            this.x + this.face * (d.fire.flameFirstOffset + i * d.fire.flameSpacing),
          );
        beep(180, 0.5, 'sawtooth', 0.05, -100);
      }
      if (this.aT >= wu + d.fire.recoverMs) {
        this.begin('idle');
        this.cool = d.fire.cooldownMs * sp;
      }
    } else if (this.state === 'wave') {
      // onda bassa che corre a terra: si scavalca solo col salto
      const wu = d.wave.windupMs * sp;
      if (this.aT < wu) {
        this.setGlow(true, DODGE_TINTS.jump);
        if (Math.random() < 0.4)
          puff(this.scene, this.x + this.face * 40, GROUND - 10, 0x7fb7ff, 1, 18, 240);
      }
      if (!this.hitDone && this.aT >= wu) {
        this.hitDone = true;
        this.host.addWave(this.x + this.face * 30, this.face * d.wave.speed);
        beep(120, 0.25, 'triangle', 0.06, -60);
      }
      if (this.aT >= wu + d.wave.recoverMs) {
        this.begin('idle');
        this.cool = d.wave.cooldownMs * sp;
      }
    }

    if (!this.dead && Math.random() < 0.3)
      puff(this.scene, this.x + this.face * 44, GROUND - 96, 0xff7a2a, 1, 12, 320);
    this.postUpdate(dt);
  }
}
