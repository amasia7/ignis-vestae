import Phaser from 'phaser';
import { GROUND } from '../config/game.config';
import { ITEMS, type ItemId } from '../data/items';
import { WEAPONS, type WeaponId } from '../data/weapons';
import type { TextureKey } from '../art/registry';

/** Oggetto o arma a terra nei livelli: fluttua finché il player la raccoglie. */
export class Pickup {
  readonly kind: 'item' | 'weapon';
  readonly id: ItemId | WeaponId;
  readonly x: number;
  private readonly img: Phaser.GameObjects.Image;
  private readonly glow: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, kind: 'item' | 'weapon', id: ItemId | WeaponId, x: number) {
    this.kind = kind;
    this.id = id;
    this.x = x;
    const key =
      kind === 'item' ? ITEMS[id as ItemId].textureKey : WEAPONS[id as WeaponId].textureKey;
    this.glow = scene.add
      .image(x, GROUND - 18, 'dot')
      .setTint(0xffd27a)
      .setScale(5, 3)
      .setAlpha(0.18)
      .setDepth(2);
    this.img = scene.add
      .image(x, GROUND - 22, key as TextureKey)
      .setOrigin(0.5, 0.5)
      .setDepth(3);
    scene.tweens.add({
      targets: this.img,
      y: GROUND - 30,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }

  rect(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(this.x - 22, GROUND - 50, 44, 50);
  }

  destroy(): void {
    this.img.destroy();
    this.glow.destroy();
  }
}
