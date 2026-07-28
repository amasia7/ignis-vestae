import type Phaser from 'phaser';

/**
 * equus — 190x120, cavallo spettrale, muso verso destra, zoccoli a y=120.
 * Port esatto del legacy r. 134-146.
 */
export function equus(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(8, 0x241820, 1);
  g.beginPath();
  g.moveTo(52, 74);
  g.lineTo(46, 118);
  g.moveTo(72, 74);
  g.lineTo(76, 118);
  g.moveTo(120, 74);
  g.lineTo(116, 118);
  g.moveTo(140, 74);
  g.lineTo(146, 118);
  g.strokePath();
  g.fillStyle(0x241820, 1);
  g.fillEllipse(96, 62, 106, 48); // corpo
  g.fillPoints(
    [
      { x: 132, y: 56 },
      { x: 160, y: 24 },
      { x: 178, y: 28 },
      { x: 152, y: 64 },
    ],
    true,
  ); // collo
  g.fillEllipse(172, 24, 30, 15); // testa
  g.fillStyle(0xff5a2a, 1);
  g.fillCircle(178, 20, 3); // occhio di brace
  g.lineStyle(5, 0x191016, 1); // criniera
  g.beginPath();
  g.moveTo(136, 52);
  g.lineTo(158, 22);
  g.strokePath();
}
