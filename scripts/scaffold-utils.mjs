import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

/** Utility condivise dagli script new:boss / new:class / new:scene. */

export function names(raw) {
  const kebab = String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!kebab) {
    console.error('Uso: npm run new:<tipo> -- nome-in-kebab-case');
    process.exit(1);
  }
  const parts = kebab.split('-');
  const pascal = parts.map((p) => p[0].toUpperCase() + p.slice(1)).join('');
  const camel = pascal[0].toLowerCase() + pascal.slice(1);
  const upper = parts.join('_').toUpperCase();
  return { kebab, pascal, camel, upper };
}

export const root = path.resolve(new URL('..', import.meta.url).pathname);

export function insertAtMarker(file, marker, snippet) {
  const full = path.join(root, file);
  const src = readFileSync(full, 'utf8');
  if (!src.includes(marker)) {
    console.error(`Marker "${marker}" non trovato in ${file}: file modificato a mano?`);
    process.exit(1);
  }
  // l'anti-duplicazione è responsabilità dello script chiamante (ensureAbsent)
  writeFileSync(full, src.replace(marker, `${snippet}${marker}`));
  console.log(`  ~ ${file}`);
}

export function extendUnion(file, marker, literal) {
  const full = path.join(root, file);
  const src = readFileSync(full, 'utf8');
  const re = new RegExp(`;\\s*// ${marker}`);
  if (!re.test(src)) {
    console.error(`Marker "${marker}" non trovato in ${file}`);
    process.exit(1);
  }
  writeFileSync(full, src.replace(re, ` | '${literal}'; // ${marker}`));
  console.log(`  ~ ${file}`);
}

/** Interrompe se l'identificatore esiste già nel file (doppia esecuzione). */
export function ensureAbsent(file, needle, what) {
  const src = readFileSync(path.join(root, file), 'utf8');
  if (src.includes(needle)) {
    console.error(`${what} esiste già in ${file}: interrompo.`);
    process.exit(1);
  }
}

export function replaceOnce(file, search, replacement) {
  const full = path.join(root, file);
  const src = readFileSync(full, 'utf8');
  if (!src.includes(search)) {
    console.error(`Testo di aggancio non trovato in ${file}: "${search}"`);
    process.exit(1);
  }
  writeFileSync(full, src.replace(search, replacement));
  console.log(`  ~ ${file}`);
}

export function writeNew(file, content) {
  const full = path.join(root, file);
  if (existsSync(full)) {
    console.error(`${file} esiste già: interrompo.`);
    process.exit(1);
  }
  writeFileSync(full, content);
  console.log(`  + ${file}`);
}
