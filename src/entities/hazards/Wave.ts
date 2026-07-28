import type Phaser from 'phaser';
import { GROUND, W } from '../../config/game.config';
import { HAZARDS } from '../../config/balance';
import { puff } from '../../fx/particles';
import { rectHitPlayer } from '../hitTests';
import type { Player } from '../Player';

/** Onda d'urto del salto-schianto del Palladio (legacy r. 820-821, 883-887). */
export class Wave {
  x: number;
  private readonly vx: number;
  private img: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, vx: number) {
    this.x = x;
    this.vx = vx;
    this.img = scene.add
      .image(x, GROUND - 14, 'dot')
      .setTint(0xffcf5e)
      .setScale(2.4, 3.4)
      .setDepth(3);
  }

  /** @returns false quando esce dallo schermo. */
  update(dt: number, scene: Phaser.Scene, player: Player, over: boolean): boolean {
    this.x += (this.vx * dt) / 1000;
    this.img.x = this.x;
    if (Math.random() < 0.6) puff(scene, this.x, GROUND - 8, 0xffcf5e, 1, 10, 220);
    const box = HAZARDS.wave.box;
    rectHitPlayer(
      player,
      over,
      this.x - box.w / 2,
      GROUND - box.h,
      box.w,
      box.h,
      HAZARDS.wave.damage,
      this.vx * HAZARDS.wave.knockbackFactor,
    );
    const m = HAZARDS.wave.despawnMargin;
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
