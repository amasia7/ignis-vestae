import type Phaser from 'phaser';

/**
 * Figura ammantata condivisa dalle tre classi: 44x70, piedi a y=70.
 * Port esatto del legacy r. 96-105.
 */
export function robedFigure(g: Phaser.GameObjects.Graphics, robe: number, trim: number): void {
  g.fillStyle(robe, 1);
  g.fillPoints(
    [
      { x: 9, y: 70 },
      { x: 35, y: 70 },
      { x: 30, y: 26 },
      { x: 14, y: 26 },
    ],
    true,
  );
  g.fillStyle(0xf0e8d8, 1);
  g.fillCircle(22, 17, 8); // volto
  g.fillStyle(robe, 1); // velo
  g.slice(22, 15, 10, Math.PI, Math.PI * 2, false);
  g.fillPath();
  g.lineStyle(3, trim, 1); // fasce
  g.beginPath();
  g.moveTo(14, 34);
  g.lineTo(30, 38);
  g.moveTo(14, 41);
  g.lineTo(30, 45);
  g.strokePath();
}
