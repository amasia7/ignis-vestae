import type { Strings } from './strings.schema';
import { STRINGS_IT } from './strings.it';

/**
 * Infrastruttura i18n minima: oggi esiste solo l'italiano. Per aggiungere una
 * lingua: creare strings.<locale>.ts che implementa `Strings` e registrarla
 * qui. Nessuna traduzione va fatta ora.
 */
export type Locale = 'it';

const BUNDLES: Record<Locale, Strings> = {
  it: STRINGS_IT,
};

let current: Locale = 'it';

export function setLocale(locale: Locale): void {
  current = locale;
}

export function getLocale(): Locale {
  return current;
}

/** Il bundle della lingua attiva. Le scene leggono le stringhe solo da qui. */
export function strings(): Strings {
  return BUNDLES[current];
}
