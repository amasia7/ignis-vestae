import Phaser from 'phaser';
import { W } from '../../config/game.config';
import { HAZARDS } from '../../config/balance';
import { puff } from '../../fx/particles';

/** Qualunque cosa il dardo possa colpire (boss o nemico dei livelli). */
export interface BoltTarget {
  rect(): Phaser.Geom.Rectangle;
  readonly dead: boolean;
}

/** Dardo di FIAMMA VOTIVA (legacy r. 822-823, 889-896). Danno 26·mult. */
export class Bolt {
  x: number;
  private readonly y: number;
  private readonly vx: number;
  private img: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number, vx: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.img = scene.add
      .image(x, y, 'bolt')
      .setDepth(5)
      .setFlipX(vx < 0);
  }

  /**
   * @param onHit callback della scena sul primo bersaglio colpito
   * @returns false quando il dardo va rimosso.
   */
  update<T extends BoltTarget>(
    dt: number,
    scene: Phaser.Scene,
    targets: readonly T[],
    onHit: (target: T) => void,
  ): boolean {
    this.x += (this.vx * dt) / 1000;
    this.img.x = this.x;
    if (Math.random() < 0.6)
      puff(
        scene,
        this.x - Math.sign(this.vx) * 8,
        this.y + Math.random() * 6 - 3,
        0xff9a3c,
        1,
        10,
        220,
      );
    let gone = false;
    for (const t of targets) {
      if (t.dead || !Phaser.Geom.Rectangle.Contains(t.rect(), this.x, this.y)) continue;
      onHit(t);
      puff(scene, this.x, this.y, 0xffb347, 12, 60, 340);
      gone = true;
      break;
    }
    const m = HAZARDS.bolt.despawnMargin;
    if (gone || this.x < m || this.x > W - m) {
      this.img.destroy();
      return false;
    }
    return true;
  }

  destroy(): void {
    this.img.destroy();
  }
}
