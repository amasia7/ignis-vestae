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

/** wp4 — falx 44x14: falce da guerra tracia, lama ricurva. */
export function falx(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x4a3a2a, 1);
  g.fillRect(0, 5, 12, 4);
  g.lineStyle(4, 0xcbb894, 1);
  g.beginPath();
  g.arc(22, 16, 14, Math.PI * 1.15, Math.PI * 1.85, false);
  g.strokePath();
}

/** wp5 — dolabra 44x16: piccone-scure dei genieri. */
export function dolabra(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x6b4a26, 1);
  g.fillRect(0, 6, 30, 4);
  g.fillStyle(0xb8a878, 1);
  g.fillTriangle(28, 8, 42, 2, 36, 8); // punta
  g.fillTriangle(28, 8, 42, 14, 36, 8); // scure
  g.fillRect(27, 1, 4, 14);
}

/** wp6 — hasta 52x10: l'asta pura dei trionfi. */
export function hasta(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(3, 0xd9c9a0, 1);
  g.beginPath();
  g.moveTo(1, 5);
  g.lineTo(40, 5);
  g.strokePath();
  g.fillStyle(0xefe3c0, 1);
  g.fillTriangle(51, 5, 38, 1, 38, 9);
  g.fillStyle(0xc9a227, 1);
  g.fillRect(34, 2, 3, 6);
}

/** sigil — 22x22: sigillo delle benedizioni (tinto per colore a runtime). */
export function sigil(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(2, 0xffffff, 0.95);
  g.strokeCircle(11, 11, 9);
  g.fillStyle(0xffffff, 0.9);
  g.fillTriangle(11, 4, 16, 14, 6, 14);
  g.fillCircle(11, 15, 2);
}

/** urn — 30x38: urna cineraria che nasconde i segreti (spezzabile). */
export function urn(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x51443a, 1);
  g.fillEllipse(15, 20, 24, 26);
  g.fillRect(8, 4, 14, 6);
  g.fillStyle(0x3a3028, 1);
  g.fillEllipse(15, 6, 16, 4);
  g.lineStyle(1.5, 0x2c2419, 0.8);
  g.strokeEllipse(15, 18, 18, 14);
  g.lineStyle(1.5, 0xc9a227, 0.35);
  g.beginPath();
  g.moveTo(7, 26);
  g.lineTo(23, 26);
  g.strokePath();
}
