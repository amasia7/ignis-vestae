import type Phaser from 'phaser';

/** wp3 — gladius 44x12: il ferro dei legionari (arma trovabile). */
export function gladius(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x2c2620, 1);
  g.fillRect(0, 4, 9, 4); // impugnatura
  g.fillStyle(0xc9a227, 1);
  g.fillRect(8, 1, 3, 10); // guardia dorata
  g.fillStyle(0xe3d6b0, 1);
  g.fillPoints(
    [
      { x: 11, y: 3 },
      { x: 40, y: 3 },
      { x: 43, y: 6 },
      { x: 40, y: 9 },
      { x: 11, y: 9 },
    ],
    true,
  ); // lama larga a punta
}

/** balsamo — 20x20: ampollina del Balsamo di Egeria (oggetto curativo). */
export function balsamo(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x2a4a3a, 1);
  g.fillCircle(10, 12, 7); // corpo di vetro
  g.fillStyle(0x7fd8a8, 0.9);
  g.fillCircle(10, 13, 5); // liquido
  g.fillStyle(0x6b4a26, 1);
  g.fillRect(8, 2, 4, 5); // tappo
}
