/**
 * Le tre classi giocabili — solo meccanica; i testi vivono nel bundle i18n
 * (stesso indice). Fonte: legacy r. 38-54, verificata dal test di fedeltà.
 */
export type ClassId = 'vestale' | 'sacerdote' | 'aruspice'; // @scaffold:class-id
export type AbilityId = 'cast' | 'smite' | 'haste';

export interface PlayerClassData {
  readonly id: ClassId;
  readonly hp: number;
  readonly stamina: number;
  readonly damageMult: number;
  readonly speed: number;
  readonly flasks: number;
  readonly abilityCooldownMs: number;
  readonly ability: AbilityId;
  readonly robeColor: number;
  readonly trimColor: number;
}

export const CLASSES: readonly PlayerClassData[] = [
  {
    id: 'vestale',
    hp: 100,
    stamina: 100,
    damageMult: 1,
    speed: 265,
    flasks: 4,
    abilityCooldownMs: 8000,
    ability: 'cast', // FIAMMA VOTIVA
    robeColor: 0xe9e2d0,
    trimColor: 0x8e2f2f,
  },
  {
    id: 'sacerdote',
    hp: 135,
    stamina: 90,
    damageMult: 1.25,
    speed: 215,
    flasks: 3,
    abilityCooldownMs: 12000,
    ability: 'smite', // IRA SACRILEGA
    robeColor: 0x5a5148,
    trimColor: 0xc9a227,
  },
  {
    id: 'aruspice',
    hp: 80,
    stamina: 115,
    damageMult: 0.85,
    speed: 325,
    flasks: 4,
    abilityCooldownMs: 14000,
    ability: 'haste', // PRESAGIO
    robeColor: 0xd8dde5,
    trimColor: 0x4a6fa0,
  },
  // @scaffold:class-list
];

/**
 * Massimi di normalizzazione delle barre statistiche nella schermata di
 * selezione (legacy r. 734): il valore più alto tra le classi per ogni stat.
 */
export const CLASS_STAT_MAX = {
  hp: 135,
  stamina: 115,
  damageMult: 1.25,
  speed: 325,
} as const;
