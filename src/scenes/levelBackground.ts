import type Phaser from 'phaser';
import { GROUND, H } from '../config/game.config';

/** Palette delle arene legacy (r. 664), riusata dai livelli a scorrimento. */
const TOPS = [0x0a0d1e, 0x0b120e, 0x170e07];
const BOTS = [0x191126, 0x141d16, 0x251505];

/** Sfondo orizzontale del livello, stesso linguaggio visivo delle arene. */
export function buildLevelBackground(scene: Phaser.Scene, arenaIdx: number, width: number): void {
  const g = scene.add.graphics().setDepth(0);
  const top = TOPS[arenaIdx] ?? TOPS[0]!;
  const bot = BOTS[arenaIdx] ?? BOTS[0]!;
  g.fillGradientStyle(top, top, bot, bot, 1);
  g.fillRect(0, 0, width, H);

  if (arenaIdx === 0) {
    g.fillStyle(0xdce1ff, 0.5);
    for (let i = 0; i < width / 10; i++)
      g.fillRect((i * 173) % width, (i * 97) % (GROUND - 160), 1.5, 1.5);
    g.fillStyle(0xe6e6d2, 0.9);
    g.fillCircle(width - 240, 80, 26);
    g.fillStyle(top, 1);
    g.fillCircle(width - 250, 72, 24);
  }

  // colonne che scandiscono il cammino
  for (let x = 240; x < width - 200; x += 460) {
    g.fillStyle(0x08050c, 0.7);
    g.fillRect(x - 14, GROUND - 230, 28, 230);
    g.fillRect(x - 21, GROUND - 238, 42, 9);
    g.fillRect(x - 19, GROUND - 6, 38, 6);
  }

  if (arenaIdx === 1) {
    // lapidi delle sepolte lungo il percorso
    g.fillStyle(0x141c16, 0.9);
    for (let x = 340; x < width - 260; x += 380) {
      const hh = 40 + (x % 2 === 0 ? 0 : 14);
      g.fillRect(x, GROUND - hh, 26, hh);
      g.slice(x + 13, GROUND - hh, 13, Math.PI, Math.PI * 2, false);
      g.fillPath();
    }
  }

  // pavimento
  g.fillStyle(arenaIdx === 1 ? 0x182018 : 0x1d1520, 1);
  g.fillRect(0, GROUND, width, H - GROUND);
  g.lineStyle(1, 0xffffff, 0.05);
  for (let x = 0; x < width + 20; x += 64) {
    g.beginPath();
    g.moveTo(x, GROUND);
    g.lineTo(x - 14, H);
    g.strokePath();
  }
  g.fillStyle(0x000000, 0.35);
  g.fillRect(0, GROUND, width, 3);
}
