import type Phaser from 'phaser';
import { W } from '../../config/game.config';
import { HAZARDS } from '../../config/balance';
import { rectHitPlayer } from '../hitTests';
import type { Player } from '../Player';

/** Lancia scagliata dal Palladio (legacy r. 818-819, 878-881). */
export class Spear {
  x: number;
  private readonly y: number;
  private readonly vx: number;
  private img: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number, vx: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.img = scene.add
      .image(x, y, 'spear')
      .setDepth(3)
      .setFlipX(vx < 0);
  }

  /** @returns false quando esce dallo schermo. */
  update(dt: number, player: Player, over: boolean): boolean {
    this.x += (this.vx * dt) / 1000;
    this.img.x = this.x;
    const box = HAZARDS.spear.box;
    rectHitPlayer(
      player,
      over,
      this.x - box.w / 2,
      this.y - box.h / 2,
      box.w,
      box.h,
      HAZARDS.spear.damage,
      this.vx * HAZARDS.spear.knockbackFactor,
    );
    const m = HAZARDS.spear.despawnMargin;
    if (this.x < m || this.x > W - m) {
      this.img.destroy();
      return false;
    }
    return true;
  }

  destroy(): void {
    this.img.destroy();
  }
}
