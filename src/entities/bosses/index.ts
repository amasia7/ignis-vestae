import type Phaser from 'phaser';
import type { BossBase, BossHost } from './BossBase';
import { Equus } from './Equus';
import { Cornelia } from './Cornelia';
import { Palladio } from './Palladio';

type BossMaker = (scene: Phaser.Scene, host: BossHost) => BossBase;

/** Ordine di incontro (il BOSS_MAKERS del legacy, r. 644). */
export const BOSS_MAKERS: readonly BossMaker[] = [
  (scene, host) => new Equus(scene, host),
  (scene, host) => new Cornelia(scene, host),
  (scene, host) => new Palladio(scene, host),
  // @scaffold:boss-maker — new:boss inserisce qui
];
