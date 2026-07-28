import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TEXTURES, TEXTURE_KEYS } from '../src/art/registry';

/**
 * Integrità del manifest asset: chiavi e dimensioni identiche ad ASSET_SIZE
 * del legacy. L'esistenza delle chiavi usate nel codice è garantita a compile
 * time dal tipo TextureKey.
 */
const html = readFileSync(new URL('../legacy/ignis-vestae.html', import.meta.url), 'utf8');

function extractAssetSize(): Record<string, [number, number]> {
  const start = html.indexOf('const ASSET_SIZE=');
  if (start < 0) throw new Error('ASSET_SIZE non trovato nel legacy');
  const open = html.indexOf('{', start);
  const end = html.indexOf('};', open);
  return new Function(`return ${html.slice(open, end + 1)};`)() as Record<string, [number, number]>;
}

describe('manifest asset', () => {
  const legacySizes = extractAssetSize();

  it('contiene tutte e sole le chiavi del legacy', () => {
    expect([...TEXTURE_KEYS].sort()).toEqual(Object.keys(legacySizes).sort());
  });

  it('dimensioni identiche ad ASSET_SIZE', () => {
    for (const key of TEXTURE_KEYS) {
      expect([...TEXTURES[key].size], `dimensioni di "${key}"`).toEqual(legacySizes[key]);
    }
  });

  it('ogni entry ha un generatore e un origine valida', () => {
    for (const key of TEXTURE_KEYS) {
      const entry = TEXTURES[key];
      expect(typeof entry.generator, `generatore di "${key}"`).toBe('function');
      expect(entry.origin[0]).toBeGreaterThanOrEqual(0);
      expect(entry.origin[0]).toBeLessThanOrEqual(1);
      expect(entry.origin[1]).toBeGreaterThanOrEqual(0);
      expect(entry.origin[1]).toBeLessThanOrEqual(1);
    }
  });
});
