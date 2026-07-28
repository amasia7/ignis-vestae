import type Phaser from 'phaser';

/**
 * ghost — 64x112: Cornelia, veste lacera, piedi (assenti) a y=112.
 * Port esatto del legacy r. 147-153.
 */
export function ghost(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0xaab3a8, 1);
  g.fillPoints(
    [
      { x: 12, y: 110 },
      { x: 20, y: 96 },
      { x: 28, y: 110 },
      { x: 36, y: 98 },
      { x: 44, y: 110 },
      { x: 50, y: 106 },
      { x: 42, y: 22 },
      { x: 22, y: 22 },
    ],
    true,
  );
  g.fillCircle(32, 16, 10); // capo velato
  g.fillStyle(0x11150f, 1);
  g.fillCircle(32, 17, 6); // volto vuoto
  g.fillStyle(0xdfe8d8, 1);
  g.fillRect(28, 14, 2, 2);
  g.fillRect(34, 14, 2, 2);
}

/** hand — 28x48: mano che erompe dal suolo (legacy r. 154-160). */
export function hand(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(5, 0xc8d4c0, 1);
  g.beginPath();
  g.moveTo(6, 48);
  g.lineTo(8, 14);
  g.moveTo(14, 48);
  g.lineTo(14, 4);
  g.moveTo(22, 48);
  g.lineTo(20, 16);
  g.strokePath();
}
