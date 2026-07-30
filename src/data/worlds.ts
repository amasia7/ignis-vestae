import type { EnemyId } from './enemies';
import type { ItemId } from './items';
import type { WeaponId } from './weapons';
import type { BuffId } from './buffs';

/**
 * Struttura a mondi: 5 livelli intermedi a durata crescente (1-2 minuti),
 * poi il custode del mondo. I livelli di uno stesso mondo condividono lo
 * sfondo; l'arena del boss è a sé; il mondo successivo cambia sfondo.
 *
 * I livelli sono GENERATI in modo deterministico (LCG con seme fisso per
 * mondo+livello): stesso layout a ogni partita, nessun dato copiato a mano.
 * I segreti sono piazzati a mano: 2 per mondo (un'arma e una benedizione),
 * nascosti dentro urne da spezzare.
 */
export const WORLD_COUNT = 3;
export const LEVELS_PER_WORLD = 5;

export interface LevelSpawn {
  readonly type: EnemyId;
  readonly x: number;
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
  readonly enemies: readonly LevelSpawn[];
  readonly items: readonly { readonly id: ItemId; readonly x: number }[];
  readonly urns: readonly UrnSpec[];
}

/** Durate crescenti: ~1 minuto il primo cammino, ~2 l'ultimo. */
const LEVEL_WIDTHS = [2000, 2700, 3400, 4200, 5000] as const;

/** Segreti dei mondi: [arma nel 2° cammino, benedizione nel 4°]. */
const WORLD_SECRETS: readonly (readonly [WeaponId, BuffId])[] = [
  ['falx', 'cenereVotiva'],
  ['dolabra', 'lacrimeEgeria'],
  ['hasta', 'fuocoInterno'],
];

/** Generatore pseudo-casuale deterministico (LCG numerico). */
function lcg(seed: number): () => number {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function levelSpec(world: number, level: number): LevelSpec {
  const rnd = lcg(world * 31 + level + 7);
  const width = (LEVEL_WIDTHS[level] ?? 2000) + world * 300;

  // nemici: crescono col cammino e col mondo
  const count = 6 + level * 3 + world * 3;
  const enemies: LevelSpawn[] = [];
  const from = 420;
  const to = width - 380;
  for (let i = 0; i < count; i++) {
    const x = from + ((to - from) * (i + 0.2 + rnd() * 0.6)) / count;
    const ombraChance = 0.35 + world * 0.1 + level * 0.03;
    enemies.push({ type: rnd() < ombraChance ? 'ombra' : 'larva', x: Math.round(x) });
  }

  // balsami sparsi lungo il cammino
  const items: { id: ItemId; x: number }[] = [];
  const nItems = 1 + Math.floor(level / 2);
  for (let i = 0; i < nItems; i++)
    items.push({ id: 'balsamo', x: Math.round(width * (0.3 + 0.4 * rnd())) });

  // segreti: arma nel cammino 2 (idx 1), benedizione nel cammino 4 (idx 3)
  const urns: UrnSpec[] = [];
  const secret = WORLD_SECRETS[world];
  if (secret) {
    if (level === 1)
      urns.push({
        x: Math.round(width * 0.62),
        content: { kind: 'weapon', id: secret[0] },
        uid: `w${world}-arma`,
      });
    if (level === 3)
      urns.push({
        x: Math.round(width * 0.44),
        content: { kind: 'buff', id: secret[1] },
        uid: `w${world}-benedizione`,
      });
  }

  return { world, level, width, arenaIdx: world, enemies, items, urns };
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
