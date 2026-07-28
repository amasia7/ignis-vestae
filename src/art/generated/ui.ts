import type Phaser from 'phaser';

/** btn — 62x62, tasto del pad virtuale (legacy r. 109-110). */
export function btn(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x181222, 0.9);
  g.fillCircle(31, 31, 30);
  g.lineStyle(2, 0xaa915a, 1);
  g.strokeCircle(31, 31, 30);
}

/** btnsm — 50x50, tasto piccolo del pad virtuale (legacy r. 111-112). */
export function btnsm(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x181222, 0.9);
  g.fillCircle(25, 25, 24);
  g.lineStyle(2, 0xaa915a, 1);
  g.strokeCircle(25, 25, 24);
}
