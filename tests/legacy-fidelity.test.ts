import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { STRINGS_IT } from '../src/data/strings.it';
import { CLASSES } from '../src/data/classes';
import { BOSSES } from '../src/data/bosses';

/**
 * Fedeltà al legacy: estrae le costanti (CLASSES, LORE, RELICS, ARENAS, nomi
 * e hp dei boss) DIRETTAMENTE da legacy/ignis-vestae.html e le confronta con
 * i moduli migrati. Se un testo o un numero diverge di un solo carattere,
 * questo test fallisce. Il file legacy è la specifica autorevole.
 */
const html = readFileSync(new URL('../legacy/ignis-vestae.html', import.meta.url), 'utf8');

interface LegacyClass {
  n: string;
  sub: string;
  d: string;
  hp: number;
  st: number;
  mult: number;
  spd: number;
  fl: number;
  cd: number;
  abN: string;
  abD: string;
  robe: number;
  trim: number;
  death: string;
}
interface LegacyRelic {
  t: string;
  d: string;
  fx: string;
}

/** Estrae il letterale array `const <name>=[...]` dal sorgente legacy e lo valuta. */
function extractArray<T>(name: string): T {
  const start = html.indexOf(`const ${name}=`);
  if (start < 0) throw new Error(`costante legacy non trovata: ${name}`);
  const open = html.indexOf('[', start);
  let depth = 0;
  let end = -1;
  for (let i = open; i < html.length; i++) {
    if (html[i] === '[') depth++;
    else if (html[i] === ']') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) throw new Error(`letterale non chiuso per: ${name}`);
  // Il legacy contiene solo letterali puri (stringhe/numeri): la valutazione è sicura.
  return new Function(`return ${html.slice(open, end + 1)};`)() as T;
}

const legacyClasses = extractArray<LegacyClass[]>('CLASSES');
const legacyLore = extractArray<string[][]>('LORE');
const legacyRelics = extractArray<LegacyRelic[]>('RELICS');
const legacyArenas = extractArray<string[]>('ARENAS');

describe('testi di lore identici al legacy', () => {
  it('le tre pagine di prologo, carattere per carattere', () => {
    expect(STRINGS_IT.lore.pages).toEqual(legacyLore);
  });

  it('le tre reliquie: titolo, descrizione, effetto', () => {
    expect(STRINGS_IT.relics.map((r) => ({ t: r.title, d: r.desc, fx: r.fx }))).toEqual(
      legacyRelics,
    );
  });

  it('i nomi delle arene', () => {
    expect([...STRINGS_IT.arenas]).toEqual(legacyArenas);
  });

  it('i testi delle classi: nome, sottotitolo, descrizione, abilità, morte', () => {
    expect(
      STRINGS_IT.classes.map((c) => ({
        n: c.name,
        sub: c.sub,
        d: c.desc,
        abN: c.abilityName,
        abD: c.abilityDesc,
        death: c.death,
      })),
    ).toEqual(
      legacyClasses.map((c) => ({
        n: c.n,
        sub: c.sub,
        d: c.d,
        abN: c.abN,
        abD: c.abD,
        death: c.death,
      })),
    );
  });

  it('nomi e sottotitoli dei boss', () => {
    const found = [...html.matchAll(/this\.name='([^']+)'; this\.sub='([^']+)';/g)].map((m) => ({
      name: m[1],
      sub: m[2],
    }));
    expect(found).toEqual([
      STRINGS_IT.bosses.equus,
      STRINGS_IT.bosses.cornelia,
      STRINGS_IT.bosses.palladio,
    ]);
  });
});

describe('numeri delle classi identici al legacy', () => {
  it('hp, stamina, mult, velocità, ampolle, ricarica, colori', () => {
    expect(
      CLASSES.map((c) => ({
        hp: c.hp,
        st: c.stamina,
        mult: c.damageMult,
        spd: c.speed,
        fl: c.flasks,
        cd: c.abilityCooldownMs,
        robe: c.robeColor,
        trim: c.trimColor,
      })),
    ).toEqual(
      legacyClasses.map((c) => ({
        hp: c.hp,
        st: c.st,
        mult: c.mult,
        spd: c.spd,
        fl: c.fl,
        cd: c.cd,
        robe: c.robe,
        trim: c.trim,
      })),
    );
  });
});

describe('hp dei boss identici al legacy', () => {
  it('300 / 340 / 460 come dichiarati nei costruttori', () => {
    const found = [...html.matchAll(/this\.mhp=(\d+); this\.hp=\1;/g)].map((m) => Number(m[1]));
    expect(found).toEqual(BOSSES.map((b) => b.hp));
  });
});
