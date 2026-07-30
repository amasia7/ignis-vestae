import type Phaser from 'phaser';

/** spear — 66x12, lancia del Palladio (legacy r. 170-173). */
export function spear(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(4, 0xe0c878, 1);
  g.beginPath();
  g.moveTo(2, 6);
  g.lineTo(52, 6);
  g.strokePath();
  g.fillStyle(0xe0c878, 1);
  g.fillTriangle(64, 6, 50, 1, 50, 11);
}

/** scutum — 26x36, scudo ovale del Sacerdote: legno bordato di bronzo. */
export function scutum(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x5a3a22, 1);
  g.fillEllipse(13, 18, 24, 34);
  g.lineStyle(2.5, 0xc9a227, 1);
  g.strokeEllipse(13, 18, 24, 34);
  g.fillStyle(0xc9a227, 1);
  g.fillCircle(13, 18, 4.5);
  g.lineStyle(1.5, 0x8a6a3a, 1);
  g.beginPath();
  g.moveTo(13, 3);
  g.lineTo(13, 33);
  g.strokePath();
}

/** brazier — 72x40, braciere (legacy r. 177-179). */
export function brazier(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x3a2a14, 1);
  g.fillRect(6, 14, 60, 26);
  g.fillStyle(0x2c2010, 1);
  g.slice(36, 14, 34, Math.PI, Math.PI * 2, false);
  g.fillPath();
}
