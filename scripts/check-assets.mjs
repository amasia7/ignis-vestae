import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { root } from './scaffold-utils.mjs';

/**
 * npm run assets:check — valida i PNG in assets/ contro il manifest:
 *  - la chiave (nome file) deve esistere in src/art/registry.ts;
 *  - l'altezza deve coincidere con quella dichiarata;
 *  - la larghezza deve essere quella dichiarata o un multiplo esatto
 *    (spritesheet a strisce orizzontali).
 * Usato dalla CI: una PR con un asset sbagliato fallisce con un messaggio chiaro.
 */
function registrySizes() {
  const src = readFileSync(path.join(root, 'src/art/registry.ts'), 'utf8');
  const sizes = new Map();
  for (const m of src.matchAll(/^\s{2}(\w+): \{ size: \[(\d+), (\d+)\]/gm))
    sizes.set(m[1], [Number(m[2]), Number(m[3])]);
  return sizes;
}

function pngSize(file) {
  const buf = readFileSync(file);
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null; // non è un PNG
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

const assetsDir = path.join(root, 'assets');
const sizes = registrySizes();
if (sizes.size === 0) {
  console.error('Impossibile leggere le dimensioni dal manifest src/art/registry.ts');
  process.exit(1);
}

const files = existsSync(assetsDir)
  ? readdirSync(assetsDir).filter((f) => f.toLowerCase().endsWith('.png'))
  : [];
let errors = 0;

for (const file of files) {
  const key = path.basename(file, path.extname(file));
  const expected = sizes.get(key);
  const label = `assets/${file}`;
  if (!expected) {
    console.error(`✗ ${label}: la chiave "${key}" non esiste nel manifest (src/art/registry.ts)`);
    errors++;
    continue;
  }
  const actual = pngSize(path.join(assetsDir, file));
  if (!actual) {
    console.error(`✗ ${label}: non è un PNG valido`);
    errors++;
    continue;
  }
  const [w, h] = expected;
  const [aw, ah] = actual;
  if (ah !== h || aw % w !== 0 || aw === 0) {
    console.error(
      `✗ ${label}: ${aw}x${ah} — attesi ${w}x${h} (o larghezza multipla di ${w} per uno spritesheet)`,
    );
    errors++;
    continue;
  }
  const frames = aw / w;
  console.log(`✓ ${label}: ${aw}x${ah}${frames > 1 ? ` (spritesheet, ${frames} frame)` : ''}`);
}

console.log(
  `\n${files.length} asset controllati, ${errors} errori. ` +
    `Chiavi disponibili nel manifest: ${sizes.size}.`,
);
process.exit(errors > 0 ? 1 : 0);
