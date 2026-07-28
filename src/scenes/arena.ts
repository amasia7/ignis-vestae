import type Phaser from 'phaser';
import { GROUND, H, W } from '../config/game.config';

/**
 * Sfondo condiviso delle arene (port esatto del legacy r. 662-690).
 * @returns le x dei bracieri laterali per l'arena 2 (Penus), altrimenti null.
 */
export function buildArena(scene: Phaser.Scene, idx: number): number[] | null {
  const g = scene.add.graphics().setDepth(0);
  const tops = [0x0a0d1e, 0x0b120e, 0x170e07];
  const bots = [0x191126, 0x141d16, 0x251505];
  const top = tops[idx] ?? tops[0]!;
  const bot = bots[idx] ?? bots[0]!;
  g.fillGradientStyle(top, top, bot, bot, 1);
  g.fillRect(0, 0, W, H);
  if (idx === 0) {
    g.fillStyle(0xdce1ff, 0.5);
    for (let i = 0; i < 40; i++) g.fillRect((i * 173) % W, (i * 97) % (GROUND - 160), 1.5, 1.5);
    g.fillStyle(0xe6e6d2, 0.9);
    g.fillCircle(820, 80, 26);
    g.fillStyle(top, 1);
    g.fillCircle(810, 72, 24);
  }
  // tempio rotondo di Vesta in silhouette
  g.fillStyle(0x000000, 0.35);
  const tx = 480;
  const ty = GROUND - 8;
  g.fillRect(tx - 120, ty - 14, 240, 14);
  for (let i = 0; i < 7; i++) g.fillRect(tx - 102 + i * 34, ty - 96, 10, 82);
  g.fillTriangle(tx - 130, ty - 96, tx, ty - 150, tx + 130, ty - 96);
  // colonne laterali
  [60, 900].forEach((x) => {
    g.fillStyle(0x08050c, 0.85);
    g.fillRect(x - 16, GROUND - 260, 32, 260);
    g.fillRect(x - 24, GROUND - 268, 48, 10);
    g.fillRect(x - 22, GROUND - 6, 44, 6);
  });
  if (idx === 1) {
    g.fillStyle(0x141c16, 0.9);
    [150, 320, 610, 780].forEach((sx, i) => {
      const hh = 40 + (i % 2) * 14;
      g.fillRect(sx, GROUND - hh, 26, hh);
      g.slice(sx + 13, GROUND - hh, 13, Math.PI, Math.PI * 2, false);
      g.fillPath();
    });
  }
  // pavimento
  g.fillStyle(idx === 1 ? 0x182018 : 0x1d1520, 1);
  g.fillRect(0, GROUND, W, H - GROUND);
  g.lineStyle(1, 0xffffff, 0.05);
  for (let x = 0; x < W + 20; x += 64) {
    g.beginPath();
    g.moveTo(x, GROUND);
    g.lineTo(x - 14, H);
    g.strokePath();
  }
  g.fillStyle(0x000000, 0.35);
  g.fillRect(0, GROUND, W, 3);
  if (idx === 2) {
    const braz = [140, 820];
    braz.forEach((x) => scene.add.image(x, GROUND, 'brazier').setOrigin(0.5, 1).setDepth(1));
    return braz;
  }
  return null;
}
