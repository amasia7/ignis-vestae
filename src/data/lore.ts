import { strings } from './i18n';

/**
 * Accessori tipizzati al contenuto narrativo della lingua attiva.
 * Il testo vive nel bundle i18n (strings.it.ts); le scene passano da qui
 * così l'aggiunta di una lingua non tocca il codice delle scene.
 */
export function lorePages(): readonly (readonly string[])[] {
  return strings().lore.pages;
}

export function arenaName(bossIdx: number): string {
  const name = strings().arenas[bossIdx];
  if (name === undefined) throw new Error(`Arena inesistente: ${bossIdx}`);
  return name;
}

export function relicStrings(bossIdx: number) {
  const relic = strings().relics[bossIdx];
  if (relic === undefined) throw new Error(`Reliquia inesistente: ${bossIdx}`);
  return relic;
}
