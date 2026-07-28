import type Phaser from 'phaser';

/** wp0 — secespita 34x10, impugnatura a sinistra (legacy r. 117-119). */
export function secespita(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x6b4a26, 1);
  g.fillRect(0, 3, 8, 4);
  g.fillStyle(0xd9c06a, 1);
  g.fillPoints(
    [
      { x: 8, y: 2 },
      { x: 32, y: 4 },
      { x: 33, y: 5 },
      { x: 32, y: 6 },
      { x: 8, y: 8 },
    ],
    true,
  );
}

/** wp1 — spatha 44x12 (legacy r. 120-123). */
export function spatha(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x3a3026, 1);
  g.fillRect(0, 4, 10, 4);
  g.fillStyle(0xc9b06a, 1);
  g.fillRect(8, 2, 4, 8);
  g.fillStyle(0xd9cba0, 1);
  g.fillPoints(
    [
      { x: 12, y: 3 },
      { x: 42, y: 5 },
      { x: 43, y: 6 },
      { x: 42, y: 7 },
      { x: 12, y: 9 },
    ],
    true,
  );
}

/** wp2 — lituus 34x36: bastone ricurvo degli àuguri (legacy r. 124-128). */
export function lituus(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(4, 0x9a8a5a, 1);
  g.beginPath();
  g.moveTo(4, 34);
  g.lineTo(20, 10);
  g.strokePath();
  g.lineStyle(3.5, 0x9a8a5a, 1);
  g.beginPath();
  g.arc(23, 8, 7, Math.PI * 0.9, Math.PI * 2.5, false);
  g.strokePath();
}
