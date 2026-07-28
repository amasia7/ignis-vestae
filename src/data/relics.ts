import { RELIC_EFFECTS } from '../config/balance';

/**
 * Le tre reliquie, una per boss (stesso indice di BOSSES e di strings.relics).
 * I testi vivono nel bundle i18n; qui solo l'effetto meccanico.
 * Fonte: legacy r. 64-74 (testi), r. 261-262 (effetti).
 */
export type RelicId = 'suffimen' | 'molaSalsa' | 'palladio';

export interface RelicData {
  readonly id: RelicId;
  /** Ampolle massime aggiuntive (SUFFIMEN, legacy r. 261). */
  readonly flaskBonus: number;
  /** Moltiplicatore applicato a mult (MOLA SALSA, legacy r. 262). */
  readonly damageMult: number;
}

export const RELICS: readonly [RelicData, RelicData, RelicData] = [
  { id: 'suffimen', flaskBonus: RELIC_EFFECTS.suffimen.flaskBonus, damageMult: 1 },
  { id: 'molaSalsa', flaskBonus: 0, damageMult: RELIC_EFFECTS.molaSalsa.damageMult },
  // IL PALLADIO non ha effetto meccanico: «Il fuoco può essere riacceso» — chiude la run.
  { id: 'palladio', flaskBonus: 0, damageMult: 1 },
];
