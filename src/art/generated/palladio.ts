import type Phaser from 'phaser';

/**
 * statue — 64x120: il Palladio, base quasi bianca (fase 2 = tinta oro).
 * Port esatto del legacy r. 161-169.
 */
export function statue(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0xdad6c8, 1);
  g.fillRect(16, 28, 32, 92); // corpo a colonna
  g.lineStyle(2, 0x000000, 0.22);
  g.beginPath();
  g.moveTo(24, 32);
  g.lineTo(22, 118);
  g.moveTo(36, 32);
  g.lineTo(38, 118);
  g.strokePath();
  g.fillStyle(0xe6e0ce, 1);
  g.fillCircle(32, 20, 12); // testa
  g.fillStyle(0x8e2f2f, 1); // cimiero
  g.fillTriangle(24, 10, 32, -2, 42, 10);
  g.fillStyle(0xb9b2a0, 1);
  g.fillCircle(12, 58, 14); // scudo
  g.lineStyle(2, 0x000000, 0.3);
  g.strokeCircle(12, 58, 8);
}
