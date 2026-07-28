import type Phaser from 'phaser';
import { CLASSES } from '../../data/classes';
import { robedFigure } from './robedFigure';

/** pl0 — Vestale (legacy r. 113). 44x70. */
export function vestale(g: Phaser.GameObjects.Graphics): void {
  robedFigure(g, CLASSES[0]!.robeColor, CLASSES[0]!.trimColor);
}

/** pl1 — Sacerdote Rinnegato, con spallaccio (legacy r. 114-115). 44x70. */
export function sacerdote(g: Phaser.GameObjects.Graphics): void {
  robedFigure(g, CLASSES[1]!.robeColor, CLASSES[1]!.trimColor);
  g.lineStyle(2, 0x2c2620, 0.9);
  g.strokeCircle(13, 40, 8);
}

/** pl2 — Aruspice (legacy r. 116). 44x70. */
export function aruspice(g: Phaser.GameObjects.Graphics): void {
  robedFigure(g, CLASSES[2]!.robeColor, CLASSES[2]!.trimColor);
}
