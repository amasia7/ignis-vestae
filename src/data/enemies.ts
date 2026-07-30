import type { ItemId } from './items';

/**
 * Mini-nemici dei livelli, data-driven come i boss: per aggiungerne uno
 * (medio, élite…) basta una voce qui + una texture nel manifest.
 * I livelli attuali mescolano guerrieri e arcieri; ombra e larva restano
 * disponibili per livelli futuri.
 */
export type EnemyId = 'guerriero' | 'arciere' | 'segugio' | 'ombra' | 'larva'; // @scaffold:enemy-id

export interface EnemyData {
  readonly id: EnemyId;
  readonly textureKey: string;
  readonly hp: number;
  readonly moveSpeed: number;
  /** Distanza a cui si accorge del player e inizia a inseguire. */
  readonly aggroRange: number;
  /** Distanza a cui carica il colpo (per i ranged: distanza di tiro). */
  readonly attackRange: number;
  readonly windupMs: number;
  readonly hit: { readonly radius: number; readonly damage: number; readonly knockback: number };
  readonly recoverMs: number;
  readonly cooldownMs: number;
  readonly hurtbox: { readonly w: number; readonly h: number };
  /** Probabilità di drop alla morte (tenuta bassa di proposito). */
  readonly dropChance: number;
  /** Cosa lascia cadere quando il tiro riesce. */
  readonly dropItem: ItemId;
  readonly glowTint: number;
  /** Fluttua come Cornelia invece di camminare. */
  readonly floats: boolean;
  /** Arciere e simili: scocca frecce invece di colpire in mischia. */
  readonly ranged: {
    readonly arrowSpeed: number;
    readonly arrowDamage: number;
    /** Sotto questa distanza arretra per riaprire il tiro. */
    readonly retreatRange: number;
  } | null;
}

export const ENEMIES: Readonly<Record<EnemyId, EnemyData>> = {
  // guerriero rinnegato: scudo tondo e gladio, avanza e affonda
  guerriero: {
    id: 'guerriero',
    textureKey: 'warrior',
    hp: 55,
    moveSpeed: 95,
    aggroRange: 340,
    attackRange: 62,
    windupMs: 420,
    hit: { radius: 50, damage: 12, knockback: 220 },
    recoverMs: 280,
    cooldownMs: 900,
    hurtbox: { w: 36, h: 60 },
    dropChance: 0.1,
    dropItem: 'balsamo',
    glowTint: 0xc9a227,
    floats: false,
    ranged: null,
  },
  // arciere scheletrico: tiene la distanza e scocca frecce di brace
  arciere: {
    id: 'arciere',
    textureKey: 'archer',
    hp: 30,
    moveSpeed: 85,
    aggroRange: 560,
    attackRange: 440,
    windupMs: 620,
    hit: { radius: 0, damage: 0, knockback: 0 }, // solo a distanza
    recoverMs: 260,
    cooldownMs: 1500,
    hurtbox: { w: 32, h: 58 },
    dropChance: 0.08,
    dropItem: 'incenso',
    glowTint: 0x8ac878,
    floats: false,
    ranged: { arrowSpeed: 430, arrowDamage: 9, retreatRange: 150 },
  },
  // segugio infernale: il nemico MEDIO pronto per i livelli futuri —
  // veloce, morde forte, va affrontato con rispetto (non ancora spawnnato)
  segugio: {
    id: 'segugio',
    textureKey: 'hound',
    hp: 75,
    moveSpeed: 170,
    aggroRange: 420,
    attackRange: 58,
    windupMs: 340,
    hit: { radius: 46, damage: 15, knockback: 260 },
    recoverMs: 240,
    cooldownMs: 800,
    hurtbox: { w: 50, h: 38 },
    dropChance: 0.1,
    dropItem: 'incenso',
    glowTint: 0xff3a1e,
    floats: false,
    ranged: null,
  },
  // spettro minore delle sepolte: lento, colpo ampio telegrafato
  ombra: {
    id: 'ombra',
    textureKey: 'shade',
    hp: 40,
    moveSpeed: 70,
    aggroRange: 280,
    attackRange: 75,
    windupMs: 500,
    hit: { radius: 55, damage: 10, knockback: 200 },
    recoverMs: 260,
    cooldownMs: 950,
    hurtbox: { w: 34, h: 58 },
    dropChance: 0.1,
    dropItem: 'balsamo',
    glowTint: 0xa8c8ff,
    floats: true,
    ranged: null,
  },
  // verme di brace: fragile e rapido, morso corto
  larva: {
    id: 'larva',
    textureKey: 'larva',
    hp: 22,
    moveSpeed: 135,
    aggroRange: 330,
    attackRange: 50,
    windupMs: 300,
    hit: { radius: 38, damage: 8, knockback: 160 },
    recoverMs: 200,
    cooldownMs: 700,
    hurtbox: { w: 34, h: 20 },
    dropChance: 0.07,
    dropItem: 'balsamo',
    glowTint: 0xff7a2a,
    floats: false,
    ranged: null,
  },
  // @scaffold:enemy-data
};
