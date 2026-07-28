import Phaser from 'phaser';
import { puff } from '../fx/particles';
import type { TextureKey } from '../art/registry';
import type { Player } from './Player';

const WEAPON_KEYS: readonly TextureKey[] = ['wp0', 'wp1', 'wp2' /* @scaffold:weapon-key */];

/**
 * Arma del player: posa per stato e fx del fendente.
 * Port esatto di poseWeapon/slashFx del legacy (r. 375-396).
 */
export class PlayerWeapon {
  private img: Phaser.GameObjects.Image;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, classIdx: number, x: number, y: number) {
    this.scene = scene;
    const key = WEAPON_KEYS[classIdx] ?? 'wp0';
    this.img = scene.add
      .image(x, y - 34, key)
      .setOrigin(0.12, 0.5)
      .setDepth(5);
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
    const s = player.spr;
    const f = player.face;
    const w = this.img;
    const state = player.state;
    const sT = player.timeInState;
    if (state === 'roll' || state === 'heal') {
      w.setVisible(false);
      return;
    }
    w.setVisible(true);
    let ang = -0.12;
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
