import Phaser from 'phaser';
import { GROUND, W } from '../../config/game.config';
import { CORNELIA } from '../../data/bosses';
import { puff, ringFx } from '../../fx/particles';
import { beep } from '../../fx/audio';
import { shake } from '../../fx/screenShake';
import { BossBase, DODGE_TINTS, type BossHost } from './BossBase';

type CorneliaState = 'idle' | 'hands' | 'grab' | 'scream' | 'tele';

/**
 * BOSS 2: CORNELIA, LA SEPOLTA VIVA — mani dal terreno telegrafate /
 * afferrata in scatto / urlo ad area / teletrasporto (che concatena sempre
 * nella afferrata). Port del legacy (r. 479-556) più il rework: telegrafi
 * colorati per risposta (mani = salto, afferrata = schivata, urlo = incasso)
 * e fase 2 sensibilmente più dura (più veloce E più dolorosa).
 */
export class Cornelia extends BossBase<CorneliaState> {
  private readonly d = CORNELIA;
  private targets: number[] = [];
  private marks: Phaser.GameObjects.Image[] = [];
  private hands: Phaser.GameObjects.Image[] = [];
  private gdir = -1;

  constructor(scene: Phaser.Scene, host: BossHost) {
    super(scene, host, CORNELIA, 'idle');
  }

  override clearMarks(): void {
    this.marks.forEach((m) => m.destroy());
    this.marks = [];
    this.hands.forEach((h) => h.destroy());
    this.hands = [];
  }

  update(dt: number): void {
    const d = this.d;
    const sp = this.sp; // fase 2 sotto 170 hp (r. 485/490)
    this.tick(dt);
    const px = this.px;
    this.node.y = GROUND + Math.sin(this.scene.time.now / d.float.periodMs) * d.float.amplitude;
    this.setGlow(false, d.glowTint);

    if (this.state === 'idle') {
      this.img.setAlpha(1);
      this.face = px < this.x ? -1 : 1;
      this.x += (this.face * d.idle.moveSpeed * dt) / 1000;
      this.cool -= dt;
      if (this.cool <= 0) {
        const dist = Math.abs(px - this.x);
        // r. 500-501: stesso albero decisionale del legacy
        if (dist < d.selector.closeDistance)
          this.begin(Math.random() < d.selector.screamChance ? 'scream' : 'grab');
        else {
          const r = Math.random();
          const next: CorneliaState =
            r < d.selector.handsChance ? 'hands' : r < d.selector.teleChance ? 'tele' : 'grab';
          this.begin(next);
          if (next === 'hands') this.placeMarks(px);
        }
      }
    } else if (this.state === 'hands') {
      const wu = d.hands.windupMs * sp;
      this.marks.forEach((m) => m.setAlpha(0.4 + 0.35 * Math.sin(this.scene.time.now / 70)));
      if (!this.hitDone && this.aT >= wu) {
        this.hitDone = true;
        this.marks.forEach((m) => m.destroy());
        this.marks = [];
        this.hands = this.targets.map((x) => {
          const h = this.scene.add
            .image(x, GROUND + 40, 'hand')
            .setOrigin(0.5, 1)
            .setDepth(3);
          this.scene.tweens.add({ targets: h, y: GROUND, duration: d.hands.handRiseMs });
          return h;
        });
        this.targets.forEach((x) => {
          this.host.circHit(
            x,
            GROUND + (d.hands.hit.offsetY ?? 0),
            d.hands.hit.radius,
            this.dmg(d.hands.hit.damage),
            0,
          );
          puff(this.scene, x, GROUND - 8, 0xb9c7b0, 8, 50, 340);
        });
        beep(140, 0.3, 'square', 0.06, -60);
        shake(this.scene, 110, 0.007);
      }
      if (this.aT >= wu + d.hands.recoverMs) {
        this.begin('idle');
        this.cool = d.hands.cooldownMs * sp;
        this.clearMarks();
        this.targets = [];
      }
    } else if (this.state === 'grab') {
      const wu = d.grab.windupMs * sp;
      if (this.aT < wu) this.setGlow(true, DODGE_TINTS.roll);
      if (!this.hitDone && this.aT >= wu) {
        this.hitDone = true;
        this.gdir = px < this.x ? -1 : 1;
      }
      if (this.aT >= wu && this.aT < wu + d.grab.dashDurationMs) {
        this.x += (this.gdir * d.grab.dashSpeed * dt) / 1000;
        this.host.rectHit(
          this.x - d.grab.hit.w / 2,
          GROUND - d.grab.hit.h,
          d.grab.hit.w,
          d.grab.hit.h,
          this.dmg(d.grab.hit.damage),
          this.gdir * d.grab.hit.knockback,
        );
      }
      if (this.aT >= wu + d.grab.endAfterWindupMs) {
        this.begin('idle');
        this.cool = d.grab.cooldownMs * sp;
      }
    } else if (this.state === 'scream') {
      const wu = d.scream.windupMs * sp;
      if (this.aT < wu) this.setGlow(true, DODGE_TINTS.tank);
      if (!this.hitDone && this.aT >= wu) {
        this.hitDone = true;
        this.host.circHit(
          this.x,
          GROUND + (d.scream.hit.offsetY ?? 0),
          d.scream.hit.radius,
          this.dmg(d.scream.hit.damage),
          (px < this.x ? -1 : 1) * d.scream.hit.knockback,
        );
        ringFx(this.scene, this.x, GROUND - 50, 0xdcebff, 4.6, 340);
        puff(this.scene, this.x, GROUND - 60, 0xdfe8ff, 22, 90, 460);
        shake(this.scene, 180, 0.012);
        beep(300, 0.5, 'sawtooth', 0.07, 300);
      }
      if (this.aT >= wu + d.scream.recoverMs) {
        this.begin('idle');
        this.cool = d.scream.cooldownMs * sp;
      }
    } else if (this.state === 'tele') {
      // r. 545-551: dissolvenza, riposizionamento verso il centro, poi grab
      if (this.aT < d.tele.fadeOutMs) this.img.setAlpha(1 - this.aT / d.tele.fadeOutMs);
      else if (!this.hitDone) {
        this.hitDone = true;
        this.x = Phaser.Math.Clamp(
          px + (px < W / 2 ? 1 : -1) * d.tele.offsetFromPlayer,
          d.tele.clampMargin,
          W - d.tele.clampMargin,
        );
      }
      if (this.aT >= d.tele.fadeOutMs && this.aT < d.tele.reappearMs)
        this.img.setAlpha((this.aT - d.tele.fadeOutMs) / (d.tele.reappearMs - d.tele.fadeOutMs));
      if (this.aT >= d.tele.reappearMs) {
        this.img.setAlpha(1);
        this.begin('grab');
      }
    }

    if (!this.dead && Math.random() < 0.2)
      puff(this.scene, this.x + (Math.random() * 30 - 15), GROUND - 8, 0xaabfaa, 1, 12, 500);
    this.postUpdate(dt);
  }

  /** Bersagli delle mani: px e px ± 80·i, clampati (legacy r. 505-510). */
  private placeMarks(px: number): void {
    const d = this.d;
    this.targets = [px];
    const n = this.phase2Active ? d.hands.pairsPhase2 : d.hands.pairsPhase1;
    for (let i = 1; i <= n; i++)
      this.targets.push(px - d.hands.spacing * i, px + d.hands.spacing * i);
    this.targets = this.targets.map((x) =>
      Phaser.Math.Clamp(x, d.hands.clampMargin, W - d.hands.clampMargin),
    );
    this.marks = this.targets.map((x) => this.scene.add.image(x, GROUND - 4, 'warn').setDepth(2));
  }
}
