/**
 * Mini-nemici dei livelli intermedi, data-driven come i boss:
 * per aggiungerne uno basta una voce qui + una texture nel manifest.
 */
export type EnemyId = 'ombra' | 'larva'; // @scaffold:enemy-id

export interface EnemyData {
  readonly id: EnemyId;
  readonly textureKey: string;
  readonly hp: number;
  readonly moveSpeed: number;
  /** Distanza a cui si accorge del player e inizia a inseguire. */
  readonly aggroRange: number;
  /** Distanza a cui carica il colpo. */
  readonly attackRange: number;
  readonly windupMs: number;
  readonly hit: { readonly radius: number; readonly damage: number; readonly knockback: number };
  readonly recoverMs: number;
  readonly cooldownMs: number;
  readonly hurtbox: { readonly w: number; readonly h: number };
  /** Probabilità di lasciar cadere un balsamo alla morte. */
  readonly dropChance: number;
  readonly glowTint: number;
  /** Fluttua come Cornelia invece di camminare. */
  readonly floats: boolean;
}

export const ENEMIES: Readonly<Record<EnemyId, EnemyData>> = {
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
    dropChance: 0.25,
    glowTint: 0xa8c8ff,
    floats: true,
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
    dropChance: 0.15,
    glowTint: 0xff7a2a,
    floats: false,
  },
  // @scaffold:enemy-data
};
