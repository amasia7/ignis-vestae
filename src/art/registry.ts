import type { TextureEntry } from './types';
import { vestale, sacerdote, aruspice } from './generated/players';
import { secespita, spatha, lituus } from './generated/weapons';
import { dot, ring, slash, bolt, warn, flameglow } from './generated/fx';
import { btn, btnsm } from './generated/ui';
import { equus } from './generated/equus';
import { ghost, hand } from './generated/cornelia';
import { statue } from './generated/palladio';
import { spear, brazier, scutum } from './generated/props';
import { gladius, balsamo, incenso, falx, dolabra, hasta, sigil, urn } from './generated/pickups';
import { shade, larva } from './generated/enemies';

/**
 * Manifest delle texture: chiave → dimensioni, origine, generatore.
 * Le dimensioni sono quelle di ASSET_SIZE legacy (r. 181-184), verificate
 * dal test di integrità. Per sostituire un artwork con un file reale basta
 * mettere `assets/<chiave>.png`: vince sul generatore senza toccare codice
 * (vedi loadTextures.ts). Per spritesheet futuri aggiungere `frames`.
 */
export const TEXTURES = {
  dot: { size: [8, 8], origin: [0.5, 0.5], generator: dot },
  ring: { size: [68, 68], origin: [0.5, 0.5], generator: ring },
  btn: { size: [62, 62], origin: [0.5, 0.5], generator: btn },
  btnsm: { size: [50, 50], origin: [0.5, 0.5], generator: btnsm },
  pl0: { size: [44, 70], origin: [0.5, 1], generator: vestale },
  pl1: { size: [44, 70], origin: [0.5, 1], generator: sacerdote },
  pl2: { size: [44, 70], origin: [0.5, 1], generator: aruspice },
  wp0: { size: [34, 10], origin: [0.12, 0.5], generator: secespita },
  wp1: { size: [44, 12], origin: [0.12, 0.5], generator: spatha },
  wp2: { size: [34, 36], origin: [0.12, 0.5], generator: lituus },
  slash: { size: [96, 96], origin: [0.5, 0.5], generator: slash },
  bolt: { size: [18, 18], origin: [0.5, 0.5], generator: bolt },
  equus: { size: [190, 120], origin: [0.5, 1], generator: equus },
  ghost: { size: [64, 112], origin: [0.5, 1], generator: ghost },
  hand: { size: [28, 48], origin: [0.5, 1], generator: hand },
  statue: { size: [64, 120], origin: [0.5, 1], generator: statue },
  spear: { size: [66, 12], origin: [0.5, 0.5], generator: spear },
  warn: { size: [76, 18], origin: [0.5, 0.5], generator: warn },
  flameglow: { size: [60, 18], origin: [0.5, 0.5], generator: flameglow },
  brazier: { size: [72, 40], origin: [0.5, 1], generator: brazier },
  wp3: { size: [44, 12], origin: [0.12, 0.5], generator: gladius },
  balsamo: { size: [20, 20], origin: [0.5, 0.5], generator: balsamo },
  incenso: { size: [20, 20], origin: [0.5, 0.5], generator: incenso },
  shade: { size: [40, 64], origin: [0.5, 1], generator: shade },
  larva: { size: [36, 22], origin: [0.5, 1], generator: larva },
  wp4: { size: [44, 14], origin: [0.12, 0.5], generator: falx },
  wp5: { size: [44, 16], origin: [0.12, 0.5], generator: dolabra },
  wp6: { size: [52, 10], origin: [0.12, 0.5], generator: hasta },
  sigil: { size: [22, 22], origin: [0.5, 0.5], generator: sigil },
  scutum: { size: [26, 36], origin: [0.5, 0.5], generator: scutum },
  urn: { size: [30, 38], origin: [0.5, 1], generator: urn },
  // @scaffold:texture — new:boss e new:class inseriscono qui
} as const satisfies Record<string, TextureEntry>;

/**
 * Chiave di texture tipizzata: usare TextureKey (non string) nelle entità
 * garantisce a compile time che ogni chiave usata esista nel manifest.
 */
export type TextureKey = keyof typeof TEXTURES;

export const TEXTURE_KEYS = Object.keys(TEXTURES) as readonly TextureKey[];
