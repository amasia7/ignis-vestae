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
      // il canvas 960x540 viene scalato dal FIT: senza questo il testo
      // sgrana; con resolution 2 resta nitido a ogni ingrandimento
      resolution: 2,
      ...extra,
    })
    .setOrigin(0.5);
}

/** Stile base per i testi creati con scene.add.text (stessa nitidezza di T). */
export function textStyle(
  size: number,
  color: string,
  extra?: Phaser.Types.GameObjects.Text.TextStyle,
): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: 'Georgia, serif',
    fontSize: `${size}px`,
    color,
    resolution: 2,
    ...extra,
  };
}
