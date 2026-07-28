import Phaser from 'phaser';
import { GROUND, W } from '../../config/game.config';
import { HAZARDS } from '../../config/balance';
import { puff } from '../../fx/particles';
import type { Player } from '../Player';

/**
 * Fiamma a terra del soffio di Equus (legacy r. 816-817, 871-876):
 * vita 4000ms, danno 7 con tick di 750ms sul fireCd del player.
 */
export class Flame {
  x: number;
  life = HAZARDS.flame.lifeMs;
  private img: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number) {
    this.x = Phaser.Math.Clamp(x, HAZARDS.flame.clampX, W - HAZARDS.flame.clampX);
    this.img = scene.add.image(this.x, GROUND - 4, 'flameglow').setDepth(2);
  }

  /** @returns false quando la fiamma si è spenta e va rimossa. */
  update(dt: number, scene: Phaser.Scene, player: Player, over: boolean): boolean {
    this.life -= dt;
    if (Math.random() < 0.5)
      puff(scene, this.x + Math.random() * 30 - 15, GROUND - 4, 0xff8c2a, 1, 14, 320);
    if (
      !over &&
      Math.abs(player.spr.x - this.x) < HAZARDS.flame.hitRangeX &&
      player.spr.y > GROUND - HAZARDS.flame.hitRangeY &&
      player.fireCd <= 0
    ) {
      const hpBefore = player.hp;
      player.hurt(HAZARDS.flame.damage, 0);
      if (player.hp < hpBefore) player.fireCd = HAZARDS.flame.tickMs;
    }
    if (this.life <= 0) {
      this.img.destroy();
      return false;
    }
    return true;
  }

  destroy(): void {
    this.img.destroy();
  }
}
