import type Phaser from 'phaser';
import type { TextureEntry } from './types';
import { TEXTURES, TEXTURE_KEYS, type TextureKey } from './registry';

/**
 * Tutti i PNG presenti in assets/ al momento della build (o del dev server).
 * Se esiste assets/<chiave>.png, quel file VINCE sul generatore procedurale:
 * si sostituisce un artwork alla volta senza toccare il codice di gioco.
 */
const ASSET_FILES = import.meta.glob('/assets/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export function assetFileFor(key: TextureKey): string | null {
  return ASSET_FILES[`/assets/${key}.png`] ?? null;
}

/** Da chiamare nel preload(): accoda i file reali dichiarati in assets/. */
export function queueRealAssets(scene: Phaser.Scene): void {
  for (const key of TEXTURE_KEYS) {
    const url = assetFileFor(key);
    if (url === null) continue;
    const entry: TextureEntry = TEXTURES[key];
    if (entry.frames) {
      scene.load.spritesheet(key, url, {
        frameWidth: entry.size[0],
        frameHeight: entry.size[1],
      });
    } else {
      scene.load.image(key, url);
    }
  }
}

/** Da chiamare nel create(): genera le texture procedurali mancanti. */
export function generateMissingTextures(scene: Phaser.Scene): void {
  for (const key of TEXTURE_KEYS) {
    if (scene.textures.exists(key)) continue; // il file reale ha vinto
    const entry = TEXTURES[key];
    const g = scene.add.graphics();
    entry.generator(g);
    g.generateTexture(key, entry.size[0], entry.size[1]);
    g.destroy();
  }
}

/** Applica l'origine dichiarata nel manifest a un'immagine appena creata. */
export function applyOrigin(img: Phaser.GameObjects.Components.Origin, key: TextureKey): void {
  const [ox, oy] = TEXTURES[key].origin;
  img.setOrigin(ox, oy);
}
