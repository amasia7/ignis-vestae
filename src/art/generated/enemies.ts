import type Phaser from 'phaser';

/** shade — 40x64: spettro minore, parente povero di Cornelia. Piedi a y=64. */
export function shade(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x8a9488, 1);
  g.fillPoints(
    [
      { x: 8, y: 62 },
      { x: 13, y: 54 },
      { x: 18, y: 62 },
      { x: 24, y: 55 },
      { x: 30, y: 62 },
      { x: 27, y: 14 },
      { x: 12, y: 14 },
    ],
    true,
  );
  g.fillCircle(20, 11, 7); // capo velato
  g.fillStyle(0x11150f, 1);
  g.fillCircle(20, 12, 4); // volto vuoto
  g.fillStyle(0xdfe8d8, 1);
  g.fillRect(17, 10, 1.5, 1.5);
  g.fillRect(21.5, 10, 1.5, 1.5);
}

/**
 * warrior — 44x64: guerriero rinnegato con scudo tondo, gladio corto e
 * sciarpa rossa (dall'asset di riferimento). Piedi a y=64, guarda a destra.
 */
export function warrior(g: Phaser.GameObjects.Graphics): void {
  // gambe e caligae
  g.fillStyle(0x4a3a2c, 1);
  g.fillRect(14, 48, 6, 14);
  g.fillRect(23, 48, 6, 14);
  g.fillStyle(0x2c2018, 1);
  g.fillRect(12, 60, 9, 4);
  g.fillRect(22, 60, 9, 4);
  // tunica e corazza
  g.fillStyle(0x6b5a44, 1);
  g.fillRect(11, 26, 21, 24);
  g.fillStyle(0x8a7458, 1);
  g.fillRect(11, 26, 21, 8); // pettorale
  // sciarpa rossa al collo
  g.fillStyle(0xa4302a, 1);
  g.fillRect(12, 22, 19, 5);
  g.fillRect(9, 26, 6, 12); // lembo che pende
  // capo con elmo
  g.fillStyle(0xd8b088, 1);
  g.fillRect(15, 10, 13, 12); // volto
  g.fillStyle(0x7a6a4a, 1);
  g.fillRect(13, 6, 17, 7); // calotta
  g.fillRect(13, 12, 4, 8); // paragnatide
  g.fillStyle(0x11150f, 1);
  g.fillRect(24, 14, 2.5, 2.5); // occhio
  // scudo tondo davanti (borchia dorata)
  g.fillStyle(0x5a3a22, 1);
  g.fillCircle(35, 38, 9);
  g.lineStyle(1.5, 0xc9a227, 1);
  g.strokeCircle(35, 38, 9);
  g.fillStyle(0xc9a227, 1);
  g.fillCircle(35, 38, 2.5);
  // gladio corto sul fianco
  g.fillStyle(0xd9cba0, 1);
  g.fillRect(2, 34, 10, 3);
  g.fillStyle(0x6b4a26, 1);
  g.fillRect(0, 33, 4, 5);
}

/**
 * archer — 40x62: arciere scheletrico dalle ossa verdastre con arco
 * fiammeggiante (dall'asset di riferimento). Piedi a y=62, guarda a destra.
 */
export function archer(g: Phaser.GameObjects.Graphics): void {
  // gambe ossute
  g.fillStyle(0x8aa878, 1);
  g.fillRect(13, 44, 4, 18);
  g.fillRect(21, 44, 4, 18);
  // cassa toracica
  g.fillStyle(0x9ab888, 1);
  g.fillRect(11, 24, 16, 20);
  g.lineStyle(1.5, 0x5a7050, 1);
  g.beginPath();
  g.moveTo(11, 29);
  g.lineTo(27, 29);
  g.moveTo(11, 34);
  g.lineTo(27, 34);
  g.moveTo(11, 39);
  g.lineTo(27, 39);
  g.strokePath(); // costole
  // teschio
  g.fillStyle(0xa8c898, 1);
  g.fillRect(12, 8, 14, 14);
  g.fillStyle(0x11150f, 1);
  g.fillRect(15, 12, 3, 4);
  g.fillRect(21, 12, 3, 4); // occhiaie
  g.fillStyle(0xff5a2a, 1);
  g.fillRect(16, 13, 1.5, 1.5);
  g.fillRect(22, 13, 1.5, 1.5); // braci negli occhi
  // arco fiammeggiante teso in avanti
  g.lineStyle(2.5, 0x6b4a26, 1);
  g.beginPath();
  g.arc(30, 30, 14, -Math.PI / 2.6, Math.PI / 2.6, false);
  g.strokePath();
  g.lineStyle(1, 0xd8d0b8, 0.9);
  g.beginPath();
  g.moveTo(30 + Math.cos(-Math.PI / 2.6) * 14, 30 + Math.sin(-Math.PI / 2.6) * 14);
  g.lineTo(30 + Math.cos(Math.PI / 2.6) * 14, 30 + Math.sin(Math.PI / 2.6) * 14);
  g.strokePath(); // corda
  g.fillStyle(0xff9a3c, 0.9);
  g.fillCircle(35, 17, 3);
  g.fillCircle(35, 43, 2.5); // fiamme sulle punte dell'arco
}

/** larva — 36x22: verme di brace, striscia a terra. Ventre a y=22. */
export function larva(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x3a2018, 1);
  g.fillEllipse(18, 14, 32, 14); // corpo
  g.fillEllipse(29, 10, 12, 10); // capo
  g.fillStyle(0xff5a2a, 1);
  g.fillCircle(31, 9, 2); // occhio di brace
  g.lineStyle(2, 0x241410, 1); // segmenti
  g.beginPath();
  g.moveTo(8, 8);
  g.lineTo(10, 18);
  g.moveTo(15, 7);
  g.lineTo(17, 19);
  g.moveTo(22, 7);
  g.lineTo(24, 18);
  g.strokePath();
}
