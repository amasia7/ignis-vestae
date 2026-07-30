import type Phaser from 'phaser';
import { rectHitPlayer } from '../hitTests';
import type { Player } from '../Player';

/** Freccia di brace degli arcieri: vola dritta finché non esce dal livello. */
export class Arrow {
  x: number;
  private readonly y: number;
  private readonly vx: number;
  private readonly damage: number;
  private readonly levelWidth: number;
  private img: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    vx: number,
    damage: number,
    levelWidth: number,
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.damage = damage;
    this.levelWidth = levelWidth;
    this.img = scene.add
      .image(x, y, 'arrow')
      .setDepth(3)
      .setFlipX(vx < 0);
  }

  /** @returns false quando esce dal livello. */
  update(dt: number, player: Player, over: boolean): boolean {
    this.x += (this.vx * dt) / 1000;
    this.img.x = this.x;
    rectHitPlayer(player, over, this.x - 15, this.y - 4, 30, 8, this.damage, this.vx * 0.35);
    if (this.x < 10 || this.x > this.levelWidth - 10) {
      this.img.destroy();
      return false;
    }
    return true;
  }

  destroy(): void {
    this.img.destroy();
  }
}
