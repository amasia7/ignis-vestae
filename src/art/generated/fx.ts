import type Phaser from 'phaser';

/** dot — 8x8, particella base (legacy r. 107). */
export function dot(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0xffffff, 1);
  g.fillCircle(4, 4, 4);
}

/** ring — 68x68, anello d'onda (legacy r. 108). */
export function ring(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(4, 0xffffff, 1);
  g.strokeCircle(34, 34, 30);
}

/** slash — 96x96, arco del fendente (legacy r. 129-131). */
export function slash(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(7, 0xffe08c, 0.95);
  g.beginPath();
  g.arc(48, 48, 38, -1.25, 0.95, false);
  g.strokePath();
}

/** bolt — 18x18, dardo di fuoco (legacy r. 132-133). */
export function bolt(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0xff8a30, 0.55);
  g.fillCircle(9, 9, 9);
  g.fillStyle(0xffd27a, 1);
  g.fillCircle(9, 9, 5);
}

/** warn — 76x18, segnale a terra (legacy r. 174-175). */
export function warn(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(2.5, 0xa0c896, 0.9);
  g.strokeEllipse(38, 9, 72, 14);
}

/** flameglow — 60x18, bagliore della fiamma a terra (legacy r. 176). */
export function flameglow(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0xff7828, 0.3);
  g.fillEllipse(30, 9, 58, 16);
}
