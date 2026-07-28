import Phaser from 'phaser';
import { W } from '../../config/game.config';
import { ABILITIES, HAZARDS } from '../../config/balance';
import { puff } from '../../fx/particles';
import type { BossBase } from '../bosses/BossBase';

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
   * @param dmgBoss callback della scena (applica flash, morte, reliquia)
   * @returns false quando il dardo va rimosso.
   */
  update(
    dt: number,
    scene: Phaser.Scene,
    boss: BossBase | null,
    playerMult: number,
    dmgBoss: (dmg: number) => void,
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
    if (boss && !boss.dead && Phaser.Geom.Rectangle.Contains(boss.rect(), this.x, this.y)) {
      dmgBoss(ABILITIES.cast.boltDamage * playerMult);
      puff(scene, this.x, this.y, 0xffb347, 12, 60, 340);
      gone = true;
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
