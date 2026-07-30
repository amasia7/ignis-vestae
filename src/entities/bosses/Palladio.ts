import Phaser from 'phaser';
import { GROUND, W } from '../../config/game.config';
import { PALLADIO } from '../../data/bosses';
import { puff, ringFx } from '../../fx/particles';
import { beep } from '../../fx/audio';
import { shake } from '../../fx/screenShake';
import { BossBase, DODGE_TINTS, type BossHost } from './BossBase';

type PalladioState = 'idle' | 'combo' | 'throw' | 'slam' | 'awaken';

/**
 * BOSS 3: IL PALLADIO — combo di lancia / lancia scagliata / salto-schianto
 * con onde d'urto / risveglio in fase 2 (hp <= 230, tinta oro).
 * Port del legacy (r. 558-643) più il rework: telegrafi colorati per
 * risposta (combo = schivata, lancia = salto, schianto = schivata,
 * risveglio = incasso) e fase 2 più veloce E più dolorosa.
 */
export class Palladio extends BossBase<PalladioState> {
  private readonly d = PALLADIO;
  private readonly spear: Phaser.GameObjects.Image;
  private combo = 2;
  private cyc = 0;
  private comboIdx = 0;
  private sx = 0;
  private tx = 0;
  private landed = false;
  private ph: 1 | 2 = 1;

  constructor(scene: Phaser.Scene, host: BossHost) {
    super(scene, host, PALLADIO, 'idle');
    this.spear = scene.add.image(6, -58, 'spear').setOrigin(0.15, 0.5);
    this.node.add(this.spear);
  }

  update(dt: number): void {
    const d = this.d;
    // r. 568-569: risveglio alla soglia (hp <= 230), una sola volta
    if (this.ph === 1 && this.phase2Active) {
      this.ph = 2;
      this.begin('awaken');
      this.node.y = GROUND;
      this.tint2 = d.phase2Tint;
      this.img.setTint(this.tint2);
    }
    const sp = this.ph === 2 ? d.phase2.speedMult : 1;
    this.tick(dt);
    const px = this.px;
    this.setGlow(false, d.glowTint);
    this.spear.setPosition(6, -58);
    this.spear.setRotation(0);

    if (this.state === 'idle') {
      this.face = px < this.x ? -1 : 1;
      const dist = Math.abs(px - this.x);
      if (dist > (d.idle.stopDistance ?? 0)) this.x += (this.face * d.idle.moveSpeed * dt) / 1000;
      this.cool -= dt;
      if (this.cool <= 0) {
        // r. 581-583: stesso albero decisionale del legacy
        if (dist > d.selector.farDistance)
          this.begin(
            this.ph === 2 && Math.random() < d.selector.slamFarChancePhase2 ? 'slam' : 'throw',
          );
        else if (this.ph === 2 && Math.random() < d.selector.slamNearChancePhase2)
          this.begin('slam');
        else {
          this.begin('combo');
          this.combo = this.ph === 2 ? d.combo.hitsPhase2 : d.combo.hitsPhase1;
          this.comboIdx = 0;
          this.cyc = 0;
        }
      }
    } else if (this.state === 'combo') {
      const wu = d.combo.windupMs * sp;
      const act = d.combo.activeMs;
      const gap = d.combo.gapMs * sp;
      const tot = wu + act + gap;
      this.cyc += dt;
      if (this.comboIdx >= this.combo) {
        this.begin('idle');
        this.cool = d.combo.cooldownMs * sp;
      } else {
        if (this.cyc <= dt * 1.5) this.face = px < this.x ? -1 : 1;
        if (this.cyc < wu) {
          this.setGlow(true, DODGE_TINTS.roll);
          this.spear.setPosition(-2, -58);
        } else if (this.cyc < wu + act) {
          this.spear.setPosition(26, -58);
          this.x += (this.face * d.combo.advanceSpeed * dt) / 1000;
          this.host.rectHit(
            this.face > 0 ? this.x : this.x - d.combo.hit.w,
            GROUND + d.combo.hitOffsetY,
            d.combo.hit.w,
            d.combo.hit.h,
            this.dmg(d.combo.hit.damage),
            this.face * d.combo.hit.knockback,
          );
          if (!this.hitDone) {
            this.hitDone = true;
            beep(240, 0.08, 'square', 0.04, -80);
          }
        }
        if (this.cyc >= tot) {
          this.cyc = 0;
          this.comboIdx++;
          this.hitDone = false;
        }
      }
    } else if (this.state === 'throw') {
      const wu = d.throw.windupMs * sp;
      if (this.aT < wu) {
        this.setGlow(true, DODGE_TINTS.jump);
        this.spear.setPosition(2, -70);
        this.spear.setRotation(-0.12);
      }
      if (!this.hitDone && this.aT >= wu) {
        this.hitDone = true;
        this.host.addSpear(
          this.x + this.face * d.throw.spawnOffsetX,
          GROUND + d.throw.spawnOffsetY,
          this.face * d.throw.spearSpeed,
        );
        beep(520, 0.12, 'sawtooth', 0.04, -200);
      }
      if (this.aT >= wu + d.throw.recoverMs) {
        this.begin('idle');
        this.cool = d.throw.cooldownMs * sp;
      }
    } else if (this.state === 'slam') {
      // r. 610: windup 330 FISSO, non scalato in fase 2 (BALANCE-NOTES §1)
      const wu = d.slam.windupMs;
      if (this.aT < wu) {
        this.setGlow(true, DODGE_TINTS.roll);
        if (!this.hitDone) {
          this.hitDone = true;
          this.landed = false;
          this.sx = this.x;
          this.tx = Phaser.Math.Clamp(px, d.slam.targetClampMargin, W - d.slam.targetClampMargin);
        }
      } else if (this.aT < wu + d.slam.flightMs) {
        const p = (this.aT - wu) / d.slam.flightMs;
        this.x = Phaser.Math.Linear(this.sx, this.tx, p);
        this.node.y = GROUND - Math.sin(p * Math.PI) * d.slam.arcHeight;
      } else {
        if (!this.landed) {
          this.landed = true;
          this.node.y = GROUND;
          shake(this.scene, d.slam.shake.durationMs, d.slam.shake.intensity);
          this.host.circHit(
            this.x,
            GROUND + (d.slam.hit.offsetY ?? 0),
            d.slam.hit.radius,
            this.dmg(d.slam.hit.damage),
            0,
          );
          this.host.addWave(this.x - d.slam.waveSpawnOffset, -d.slam.waveSpeed);
          this.host.addWave(this.x + d.slam.waveSpawnOffset, d.slam.waveSpeed);
          ringFx(this.scene, this.x, GROUND - 16, 0xffd76b, 3.4, 300);
          puff(this.scene, this.x, GROUND - 6, 0xffd76b, 18, 80, 420);
          beep(80, 0.4, 'square', 0.08, -40);
        }
        if (this.aT >= wu + d.slam.endAfterWindupMs) {
          this.begin('idle');
          this.cool = d.slam.cooldownMs;
        }
      }
    } else if (this.state === 'awaken') {
      this.setGlow(true, 0xffe28a);
      if (!this.hitDone && this.aT >= d.awaken.blastAtMs) {
        this.hitDone = true;
        this.host.circHit(
          this.x,
          GROUND + (d.awaken.hit.offsetY ?? 0),
          d.awaken.hit.radius,
          this.dmg(d.awaken.hit.damage),
          (px < this.x ? -1 : 1) * d.awaken.hit.knockback,
        );
        ringFx(this.scene, this.x, GROUND - 50, 0xffe28a, 4.4, 420);
        puff(this.scene, this.x, GROUND - 60, 0xffe28a, 28, 100, 520);
        shake(this.scene, 180, 0.012);
        beep(200, 0.8, 'sawtooth', 0.08, 200);
      }
      if (this.aT >= d.awaken.durationMs) {
        this.begin('idle');
        this.cool = d.awaken.cooldownMs;
      }
    }

    if (this.ph === 2 && !this.dead && Math.random() < 0.25)
      puff(this.scene, this.x + (Math.random() * 30 - 15), GROUND - 96, 0xffd76b, 1, 10, 320);
    this.postUpdate(dt);
  }
}
