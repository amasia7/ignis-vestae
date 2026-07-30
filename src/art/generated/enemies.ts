import type Phaser from 'phaser';

/** shade — 40x64: spettro minore, parente povero di Cornelia. Piedi a y=64. */
export function shade(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x8a9488, 1);
  g.fillPoints(
    [
      { x: 8, y: 62 },
      { x: 13, y: 54 },
      { x: 18, y: 62 },
      { x: 24, y: 55 },
      { x: 30, y: 62 },
      { x: 27, y: 14 },
      { x: 12, y: 14 },
    ],
    true,
  );
  g.fillCircle(20, 11, 7); // capo velato
  g.fillStyle(0x11150f, 1);
  g.fillCircle(20, 12, 4); // volto vuoto
  g.fillStyle(0xdfe8d8, 1);
  g.fillRect(17, 10, 1.5, 1.5);
  g.fillRect(21.5, 10, 1.5, 1.5);
}

/** larva — 36x22: verme di brace, striscia a terra. Ventre a y=22. */
export function larva(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x3a2018, 1);
  g.fillEllipse(18, 14, 32, 14); // corpo
  g.fillEllipse(29, 10, 12, 10); // capo
  g.fillStyle(0xff5a2a, 1);
  g.fillCircle(31, 9, 2); // occhio di brace
  g.lineStyle(2, 0x241410, 1); // segmenti
  g.beginPath();
  g.moveTo(8, 8);
  g.lineTo(10, 18);
  g.moveTo(15, 7);
  g.lineTo(17, 19);
  g.moveTo(22, 7);
  g.lineTo(24, 18);
  g.strokePath();
}
