import type Phaser from 'phaser';

/** Helper testo centrato in Georgia serif (il T() del legacy, r. 201-205). */
export function T(
  scene: Phaser.Scene,
  x: number,
  y: number,
  str: string,
  size: number,
  color: string,
  extra?: Phaser.Types.GameObjects.Text.TextStyle,
): Phaser.GameObjects.Text {
  return scene.add
    .text(x, y, str, {
      fontFamily: 'Georgia, serif',
      fontSize: `${size}px`,
      color,
      align: 'center',
      ...extra,
    })
    .setOrigin(0.5);
}
