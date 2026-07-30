import Phaser from 'phaser';
import { GROUND } from '../config/game.config';
import { ITEMS, type ItemId } from '../data/items';
import { WEAPONS, type WeaponId } from '../data/weapons';
import { BUFFS, type BuffId } from '../data/buffs';
import type { TextureKey } from '../art/registry';

export type PickupKind = 'item' | 'weapon' | 'buff';
export type PickupId = ItemId | WeaponId | BuffId;

/** Oggetto, arma o benedizione a terra: fluttua finché il player la raccoglie. */
export class Pickup {
  readonly kind: PickupKind;
  readonly id: PickupId;
  readonly x: number;
  /** uid del segreto (urna) da cui proviene, per non farlo ricomparire. */
  readonly secretUid: string | null;
  private readonly img: Phaser.GameObjects.Image;
  private readonly glow: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, kind: PickupKind, id: PickupId, x: number, secretUid?: string) {
    this.kind = kind;
    this.id = id;
    this.x = x;
    this.secretUid = secretUid ?? null;
    const key =
      kind === 'item'
        ? ITEMS[id as ItemId].textureKey
        : kind === 'weapon'
          ? WEAPONS[id as WeaponId].textureKey
          : BUFFS[id as BuffId].textureKey;
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
    if (kind === 'buff') this.img.setTint(BUFFS[id as BuffId].tint);
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
