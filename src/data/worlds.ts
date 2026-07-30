import type { EnemyId } from './enemies';
import type { ItemId } from './items';
import type { WeaponId } from './weapons';
import type { BuffId } from './buffs';

/**
 * Struttura a mondi: 3 mini livelli con platforming (piattaforme sospese e
 * braci da saltare), poi il custode del mondo. I livelli di uno stesso mondo
 * condividono lo sfondo; l'arena del boss è a sé; il mondo dopo cambia sfondo.
 *
 * I TRE layout sono DISEGNATI A MANO qui sotto (niente più generazione
 * casuale): ogni livello mescola guerrieri e arcieri, e i mondi successivi
 * aggiungono nemici extra in modo deterministico. Per introdurre nemici medi
 * o élite in livelli futuri basta una voce in ENEMIES e uno spawn qui.
 */
/**
 * Il gioco PARTE volutamente piccolo: UN mondo — 3 mini livelli e il suo
 * custode (Equus October). I layout scalano già su più mondi e i dati di
 * Cornelia e del Palladio restano pronti: per riaprire i mondi successivi
 * basta alzare questo numero.
 */
export const WORLD_COUNT = 1;
export const LEVELS_PER_WORLD = 3;

export interface LevelSpawn {
  readonly type: EnemyId;
  readonly x: number;
  /** Quota del piano su cui sta (superficie di una piattaforma); default: terra. */
  readonly y?: number;
}

/** Piattaforma sospesa: x è il centro, y la superficie calpestabile. */
export interface PlatformSpec {
  readonly x: number;
  readonly y: number;
  readonly w: number;
}

/** Trincea di braci sul terreno: si salta o si aggira, toccarla brucia. */
export interface ObstacleSpec {
  readonly x: number;
  readonly w: number;
}

export type SecretContent =
  | { readonly kind: 'weapon'; readonly id: WeaponId }
  | { readonly kind: 'buff'; readonly id: BuffId }
  | { readonly kind: 'item'; readonly id: ItemId };

export interface UrnSpec {
  readonly x: number;
  readonly content: SecretContent;
  /** Identificatore stabile per non far ricomparire i segreti già presi. */
  readonly uid: string;
}

export interface LevelSpec {
  readonly world: number;
  readonly level: number;
  readonly width: number;
  readonly arenaIdx: number;
  readonly platforms: readonly PlatformSpec[];
  readonly obstacles: readonly ObstacleSpec[];
  readonly enemies: readonly LevelSpawn[];
  readonly items: readonly { readonly id: ItemId; readonly x: number }[];
  readonly urns: readonly UrnSpec[];
}

/** Segreti dei mondi: [arma nel 2° cammino, benedizione nel 3°]. */
const WORLD_SECRETS: readonly (readonly [WeaponId, BuffId])[] = [
  ['falx', 'cenereVotiva'],
  ['dolabra', 'lacrimeEgeria'],
  ['hasta', 'fuocoInterno'],
];

/** Quota del terreno (game.config.GROUND) e quote comode dei due piani. */
const P1 = 350; // primo piano: un salto dal terreno
const P2 = 258; // secondo piano: un salto dal primo

interface LevelLayout {
  readonly width: number;
  readonly platforms: readonly PlatformSpec[];
  readonly obstacles: readonly ObstacleSpec[];
  readonly enemies: readonly LevelSpawn[];
  readonly items: readonly { readonly id: ItemId; readonly x: number }[];
}

/** I tre cammini, dal più breve al più lungo. */
const LAYOUTS: readonly LevelLayout[] = [
  // Cammino I — introduzione: due salti, un arciere in quota
  {
    width: 2200,
    platforms: [
      { x: 640, y: P1, w: 180 },
      { x: 1020, y: P2, w: 160 },
      { x: 1520, y: P1, w: 200 },
    ],
    obstacles: [
      { x: 830, w: 80 },
      { x: 1740, w: 100 },
    ],
    enemies: [
      { type: 'guerriero', x: 520 },
      { type: 'arciere', x: 900 },
      { type: 'guerriero', x: 1180 },
      { type: 'arciere', x: 1520, y: P1 },
      { type: 'guerriero', x: 1920 },
    ],
    items: [{ id: 'balsamo', x: 1020 }],
  },
  // Cammino II — verticalità piena: doppio piano e tiro incrociato
  {
    width: 3000,
    platforms: [
      { x: 540, y: P1, w: 170 },
      { x: 840, y: P2, w: 150 },
      { x: 1190, y: P1, w: 180 },
      { x: 1780, y: P1, w: 220 },
      { x: 2090, y: P2, w: 160 },
      { x: 2440, y: P1, w: 170 },
    ],
    obstacles: [
      { x: 990, w: 90 },
      { x: 1480, w: 110 },
      { x: 2270, w: 90 },
    ],
    enemies: [
      { type: 'guerriero', x: 470 },
      { type: 'arciere', x: 840, y: P2 },
      { type: 'guerriero', x: 1080 },
      { type: 'guerriero', x: 1650 },
      { type: 'arciere', x: 1780, y: P1 },
      { type: 'guerriero', x: 2220 },
      { type: 'arciere', x: 2440, y: P1 },
      { type: 'guerriero', x: 2720 },
    ],
    items: [
      { id: 'balsamo', x: 1190 },
      { id: 'incenso', x: 2090 },
    ],
  },
  // Cammino III — il guanto: piani alternati e braci frequenti
  {
    width: 3800,
    platforms: [
      { x: 620, y: P1, w: 170 },
      { x: 930, y: P2, w: 150 },
      { x: 1280, y: P1, w: 170 },
      { x: 1950, y: P1, w: 260 },
      { x: 2290, y: P2, w: 160 },
      { x: 2640, y: P1, w: 170 },
      { x: 3160, y: P1, w: 200 },
    ],
    obstacles: [
      { x: 780, w: 90 },
      { x: 1560, w: 120 },
      { x: 2470, w: 90 },
      { x: 3390, w: 110 },
    ],
    enemies: [
      { type: 'guerriero', x: 500 },
      { type: 'arciere', x: 930, y: P2 },
      { type: 'guerriero', x: 1130 },
      { type: 'arciere', x: 1280, y: P1 },
      { type: 'guerriero', x: 1800 },
      { type: 'guerriero', x: 2100 },
      { type: 'arciere', x: 2290, y: P2 },
      { type: 'guerriero', x: 2820 },
      { type: 'arciere', x: 3160, y: P1 },
      { type: 'guerriero', x: 3520 },
    ],
    items: [
      { id: 'balsamo', x: 1400 },
      { id: 'incenso', x: 2640 },
      { id: 'balsamo', x: 3000 },
    ],
  },
];

/** Generatore pseudo-casuale deterministico (LCG) per i rinforzi dei mondi. */
function lcg(seed: number): () => number {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function levelSpec(world: number, level: number): LevelSpec {
  const l = Math.max(0, Math.min(LEVELS_PER_WORLD - 1, level));
  const layout = LAYOUTS[l] ?? LAYOUTS[0]!;

  // mondi successivi: rinforzi deterministici a terra (2 per mondo)
  const enemies: LevelSpawn[] = [...layout.enemies];
  const rnd = lcg(world * 31 + l + 7);
  for (let i = 0; i < world * 2; i++) {
    const x = Math.round(500 + rnd() * (layout.width - 1000));
    enemies.push({ type: i % 2 === 0 ? 'guerriero' : 'arciere', x });
  }

  // segreti: arma nel cammino II (idx 1), benedizione nel cammino III (idx 2)
  const urns: UrnSpec[] = [];
  const secret = WORLD_SECRETS[world];
  if (secret) {
    if (l === 1)
      urns.push({
        x: Math.round(layout.width * 0.62),
        content: { kind: 'weapon', id: secret[0] },
        uid: `w${world}-arma`,
      });
    if (l === 2)
      urns.push({
        x: Math.round(layout.width * 0.44),
        content: { kind: 'buff', id: secret[1] },
        uid: `w${world}-benedizione`,
      });
  }

  return {
    world,
    level: l,
    width: layout.width,
    arenaIdx: world,
    platforms: layout.platforms,
    obstacles: layout.obstacles,
    enemies,
    items: layout.items,
    urns,
  };
}

/** Numeri romani per mondi e cammini (1..20 bastano e avanzano). */
export function roman(n: number): string {
  const table: readonly (readonly [number, string])[] = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let out = '';
  let v = Math.max(1, Math.floor(n));
  for (const [val, sym] of table)
    while (v >= val) {
      out += sym;
      v -= val;
    }
  return out;
}
