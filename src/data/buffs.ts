/**
 * Benedizioni: buff permanenti per la run, trovati nei segreti dei mondi o
 * lasciati dai custodi sconfitti. Si applicano al Player alla creazione
 * (e il danno anche al volo); si vedono nell'inventario, sezione passiva.
 */
export type BuffId =
  'cenereVotiva' | 'lacrimeEgeria' | 'fuocoInterno' | 'veloSepolta' | 'sigilloVesta'; // @scaffold:buff-id

export type BuffEffect = 'maxHp' | 'stamina' | 'flask' | 'damagePct' | 'speedPct';

export interface BuffData {
  readonly id: BuffId;
  readonly textureKey: string;
  readonly effect: BuffEffect;
  readonly amount: number;
  /** Tinta del sigillo a terra (stessa texture per tutti i buff). */
  readonly tint: number;
}

export const BUFFS: Readonly<Record<BuffId, BuffData>> = {
  // segreto del Mondo 1
  cenereVotiva: {
    id: 'cenereVotiva',
    textureKey: 'sigil',
    effect: 'stamina',
    amount: 15,
    tint: 0xffd27a,
  },
  // segreto del Mondo 2
  lacrimeEgeria: {
    id: 'lacrimeEgeria',
    textureKey: 'sigil',
    effect: 'flask',
    amount: 1,
    tint: 0x7fd8e8,
  },
  // segreto del Mondo 3
  fuocoInterno: {
    id: 'fuocoInterno',
    textureKey: 'sigil',
    effect: 'speedPct',
    amount: 8,
    tint: 0xff8a3c,
  },
  // lasciato da Cornelia
  veloSepolta: {
    id: 'veloSepolta',
    textureKey: 'sigil',
    effect: 'maxHp',
    amount: 15,
    tint: 0xa8c8ff,
  },
  // lasciato dal Palladio
  sigilloVesta: {
    id: 'sigilloVesta',
    textureKey: 'sigil',
    effect: 'damagePct',
    amount: 10,
    tint: 0xe8cf7a,
  },
  // @scaffold:buff-data
};

/** Bottino dei custodi: cosa lascia ogni boss alla sua caduta. */
export type BossDrop = { kind: 'weapon'; id: string } | { kind: 'buff'; id: BuffId };

export const BOSS_DROPS: readonly BossDrop[] = [
  { kind: 'weapon', id: 'gladius' }, // Equus October
  { kind: 'buff', id: 'veloSepolta' }, // Cornelia
  { kind: 'weapon', id: 'flammeus' }, // Il Palladio: l'ENSIS FLAMMEUS
];
