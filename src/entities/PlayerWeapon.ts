import Phaser from 'phaser';
import { puff } from '../fx/particles';
import { RUN } from '../core/RunState';
import { WEAPONS } from '../data/weapons';
import type { Player } from './Player';

/**
 * Arma del player: posa per stato e fx del fendente.
 * Port esatto di poseWeapon/slashFx del legacy (r. 375-396).
 */
export class PlayerWeapon {
  private img: Phaser.GameObjects.Image;
  private shieldImg: Phaser.GameObjects.Image;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, _classIdx: number, x: number, y: number) {
    this.scene = scene;
    this.img = scene.add
      .image(x, y - 34, WEAPONS[RUN.equippedWeapon].textureKey)
      .setOrigin(0.12, 0.5)
      .setDepth(5);
    this.shieldImg = scene.add
      .image(x, y - 36, 'scutum')
      .setDepth(5)
      .setVisible(false);
  }

  /** L'arma può cambiare dalla borsa anche a metà scena. */
  private syncTexture(): void {
    const key = WEAPONS[RUN.equippedWeapon].textureKey;
    if (this.img.texture.key !== key) this.img.setTexture(key);
  }

  slashFx(player: Player, scale: number): void {
    const s = player.spr;
    const fx = this.scene.add
      .image(s.x + player.face * 8, s.y - 40, 'slash')
      .setDepth(5)
      .setScale(scale)
      .setFlipX(player.face < 0)
      .setAlpha(0.95);
    this.scene.tweens.add({
      targets: fx,
      alpha: 0,
      scale: scale * 1.15,
      duration: 150,
      onComplete: () => fx.destroy(),
    });
  }

  pose(player: Player): void {
    this.syncTexture();
    const s = player.spr;
    const f = player.face;
    const w = this.img;
    const state = player.state;
    const sT = player.timeInState;
    // in guardia: scudo alzato davanti, arma nascosta
    if (state === 'guard') {
      w.setVisible(false);
      this.shieldImg
        .setVisible(true)
        .setPosition(s.x + f * 17, s.y - 36)
        .setFlipX(f < 0);
      return;
    }
    this.shieldImg.setVisible(false);
    if (state === 'roll' || state === 'heal') {
      w.setVisible(false);
      return;
    }
    w.setVisible(true);
    let ang = -0.12;
    // carica del colpo: l'arma si solleva progressivamente
    if (player.chargeProgress > 0) ang = -0.2 - player.chargeProgress * 1.1;
    if (state === 'attL')
      ang = sT < 110 ? -0.65 : Phaser.Math.Linear(-0.9, 0.75, Math.min(1, (sT - 110) / 110));
    if (state === 'attH')
      ang = sT < 300 ? -1.0 : Phaser.Math.Linear(-1.2, 0.9, Math.min(1, (sT - 300) / 150));
    if (state === 'smite') ang = sT < 360 ? -1.5 : 0.6;
    if (state === 'cast') ang = -0.35;
    w.setPosition(s.x + f * 13, s.y - 35);
    if (f > 0) {
      w.setFlipY(false);
      w.setRotation(ang);
    } else {
      w.setFlipY(true);
      w.setRotation(Math.PI - ang);
    }
    if (state === 'cast' && sT < 260) {
      if (Math.random() < 0.5) puff(this.scene, s.x + f * 26, s.y - 42, 0xff9a3c, 1, 16, 180);
    }
  }

  destroy(): void {
    this.img.destroy();
  }
}
