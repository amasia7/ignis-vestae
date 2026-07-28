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

/** brazier — 72x40, braciere (legacy r. 177-179). */
export function brazier(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x3a2a14, 1);
  g.fillRect(6, 14, 60, 26);
  g.fillStyle(0x2c2010, 1);
  g.slice(36, 14, 34, Math.PI, Math.PI * 2, false);
  g.fillPath();
}
