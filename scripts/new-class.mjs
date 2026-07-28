import {
  names,
  ensureAbsent,
  insertAtMarker,
  extendUnion,
  replaceOnce,
  writeNew,
} from './scaffold-utils.mjs';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { root } from './scaffold-utils.mjs';

/**
 * npm run new:class -- nome-classe
 * Genera: voce in data/classes.ts, testi stub, artwork placeholder plN/wpN
 * nel manifest, chiavi nel Player. L'abilità parte come stub 'cast'.
 */
const { kebab, pascal, camel, upper } = names(process.argv[2]);

// indice della nuova classe = numero di voci attuali
const classesSrc = readFileSync(path.join(root, 'src/data/classes.ts'), 'utf8');
const idx = (classesSrc.match(/robeColor:/g) ?? []).length;

ensureAbsent('src/data/classes.ts', `'${camel}'`, `La classe "${kebab}"`);
extendUnion('src/data/classes.ts', '@scaffold:class-id', camel);

insertAtMarker(
  'src/data/classes.ts',
  '// @scaffold:class-list',
  `{
    id: '${camel}',
    hp: 100, // TODO: bilanciare
    stamina: 100,
    damageMult: 1,
    speed: 265,
    flasks: 4,
    abilityCooldownMs: 10000,
    ability: 'cast', // TODO: abilità dedicata (stub)
    robeColor: 0xc8b8a8,
    trimColor: 0x6a4a8a,
  },
  `,
);

insertAtMarker(
  'src/data/strings.it.ts',
  '// @scaffold:class-strings',
  `{
      name: '${upper.replace(/_/g, ' ')}',
      sub: 'TODO: sottotitolo',
      desc: 'TODO: descrizione.',
      abilityName: 'TODO ABILITÀ',
      abilityDesc: 'TODO: descrizione abilità',
      death: 'SEI  PERITO',
    },
    `,
);

writeNew(
  `src/art/generated/${camel}.ts`,
  `import type Phaser from 'phaser';
import { robedFigure } from './robedFigure';

/** Placeholder di ${pascal} (sostituiscilo con assets/pl${idx}.png). */
export function ${camel}(g: Phaser.GameObjects.Graphics): void {
  robedFigure(g, 0xc8b8a8, 0x6a4a8a);
}

/** Arma placeholder 34x10 (sostituiscila con assets/wp${idx}.png). */
export function ${camel}Weapon(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x6b4a26, 1);
  g.fillRect(0, 3, 8, 4);
  g.fillStyle(0xd9c06a, 1);
  g.fillRect(8, 4, 24, 2);
}
`,
);

insertAtMarker(
  'src/art/registry.ts',
  '// @scaffold:texture',
  `pl${idx}: { size: [44, 70], origin: [0.5, 1], generator: ${camel} },
  wp${idx}: { size: [34, 10], origin: [0.12, 0.5], generator: ${camel}Weapon },
  `,
);
replaceOnce(
  'src/art/registry.ts',
  "import { spear, brazier } from './generated/props';",
  `import { spear, brazier } from './generated/props';\nimport { ${camel}, ${camel}Weapon } from './generated/${camel}';`,
);

replaceOnce(
  'src/entities/Player.ts',
  '/* @scaffold:player-key */',
  `, 'pl${idx}' /* @scaffold:player-key */`,
);
replaceOnce(
  'src/entities/PlayerWeapon.ts',
  '/* @scaffold:weapon-key */',
  `, 'wp${idx}' /* @scaffold:weapon-key */`,
);

console.log(`
Classe "${kebab}" generata (indice ${idx}). Passi successivi:
  1. bilancia i numeri in src/data/classes.ts e scrivi i testi in strings.it.ts
  2. implementa l'abilità dedicata (oggi stub 'cast') in entities/Player.ts
  3. la Select mostra le carte a passo fisso: con più di 3 classi adattala
  4. npm run lint && npm run typecheck && npm run test
`);
