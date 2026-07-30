import type { EnemyId } from './enemies';
import type { ItemId } from './items';
import type { WeaponId } from './weapons';

/**
 * Livelli intermedi: progressione orizzontale da sinistra a destra prima di
 * ogni boss. Il braciere in fondo ristora e apre lo scontro col custode
 * (il boss parte quindi sempre a piena vita: il suo bilanciamento legacy
 * non cambia).
 */
export interface LevelSpawn {
  readonly type: EnemyId;
  readonly x: number;
}

export interface LevelPickup {
  readonly kind: 'item' | 'weapon';
  readonly id: ItemId | WeaponId;
  readonly x: number;
}

export interface LevelData {
  /** Larghezza del mondo in px (lo schermo è 960). */
  readonly width: number;
  /** Tema visivo: indice dell'arena del boss corrispondente. */
  readonly arenaIdx: number;
  readonly enemies: readonly LevelSpawn[];
  readonly pickups: readonly LevelPickup[];
}

export const LEVELS: readonly LevelData[] = [
  // verso il Campo Marzio: prime larve di brace
  {
    width: 2400,
    arenaIdx: 0,
    enemies: [
      { type: 'larva', x: 520 },
      { type: 'larva', x: 900 },
      { type: 'ombra', x: 1250 },
      { type: 'larva', x: 1600 },
      { type: 'ombra', x: 1950 },
    ],
    pickups: [{ kind: 'item', id: 'balsamo', x: 1400 }],
  },
  // il Campus Sceleratus: le sepolte si fanno più fitte
  {
    width: 2600,
    arenaIdx: 1,
    enemies: [
      { type: 'ombra', x: 480 },
      { type: 'larva', x: 800 },
      { type: 'ombra', x: 1100 },
      { type: 'larva', x: 1350 },
      { type: 'larva', x: 1600 },
      { type: 'ombra', x: 2000 },
    ],
    pickups: [{ kind: 'item', id: 'balsamo', x: 1750 }],
  },
  // la discesa al Penus: la guardia del Palladio
  {
    width: 2800,
    arenaIdx: 2,
    enemies: [
      { type: 'ombra', x: 450 },
      { type: 'larva', x: 750 },
      { type: 'larva', x: 950 },
      { type: 'ombra', x: 1250 },
      { type: 'larva', x: 1550 },
      { type: 'ombra', x: 1850 },
      { type: 'larva', x: 2150 },
      { type: 'ombra', x: 2350 },
    ],
    pickups: [
      { kind: 'weapon', id: 'gladius', x: 1450 },
      { kind: 'item', id: 'balsamo', x: 2250 },
    ],
  },
];
