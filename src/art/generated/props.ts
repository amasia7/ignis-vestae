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

/** platform — 160x18, lastra di pietra sospesa (scalata in larghezza). */
export function platform(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x3a332c, 1);
  g.fillRect(0, 4, 160, 14);
  g.fillStyle(0x54493c, 1);
  g.fillRect(0, 0, 160, 6); // bordo calpestabile più chiaro
  g.lineStyle(1.5, 0x241f1a, 0.8);
  g.beginPath();
  g.moveTo(40, 6);
  g.lineTo(36, 18);
  g.moveTo(84, 6);
  g.lineTo(88, 18);
  g.moveTo(126, 6);
  g.lineTo(122, 18);
  g.strokePath(); // giunti tra i blocchi
}

/** arrow — 30x6, freccia fiammeggiante degli arcieri. */
export function arrow(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(2, 0x8a6a3a, 1);
  g.beginPath();
  g.moveTo(2, 3);
  g.lineTo(24, 3);
  g.strokePath();
  g.fillStyle(0xff9a3c, 1);
  g.fillTriangle(30, 3, 22, 0, 22, 6); // punta di brace
  g.fillStyle(0xd8d0b8, 1);
  g.fillTriangle(2, 3, 7, 0, 7, 6); // impennaggio
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
