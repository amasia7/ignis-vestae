import Phaser from 'phaser';
import { GROUND } from '../config/game.config';
import { puff } from '../fx/particles';
import { beep } from '../fx/audio';
import type { SecretContent } from '../data/worlds';

/**
 * Urna cineraria che nasconde un segreto: si spezza con un colpo.
 * Un luccichio discreto la tradisce solo da vicino.
 */
export class Urn {
  readonly x: number;
  readonly content: SecretContent;
  readonly uid: string;
  broken = false;
  private readonly img: Phaser.GameObjects.Image;
  private readonly scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, content: SecretContent, uid: string) {
    this.scene = scene;
    this.x = x;
    this.content = content;
    this.uid = uid;
    this.img = scene.add.image(x, GROUND, 'urn').setOrigin(0.5, 1).setDepth(2);
  }

  rect(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(this.x - 15, GROUND - 38, 30, 38);
  }

  /** Luccichio solo quando il player è vicino: il segreto va notato. */
  update(playerX: number): void {
    if (this.broken) return;
    if (Math.abs(playerX - this.x) < 220 && Math.random() < 0.08)
      puff(this.scene, this.x + (Math.random() * 16 - 8), GROUND - 30, 0xffe08c, 1, 8, 500);
  }

  /** @returns true se il colpo l'ha spezzata ora. */
  smash(): boolean {
    if (this.broken) return false;
    this.broken = true;
    puff(this.scene, this.x, GROUND - 18, 0x8d7c5c, 16, 60, 420);
    beep(340, 0.12, 'square', 0.05, -180);
    this.img.destroy();
    return true;
  }

  destroy(): void {
    this.img.destroy();
  }
}
