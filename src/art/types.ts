import type Phaser from 'phaser';

/** Disegna nel riquadro (0,0)-(w,h) su un Graphics già pulito, come nel legacy. */
export type TextureGenerator = (g: Phaser.GameObjects.Graphics) => void;

export interface TextureEntry {
  /** Dimensioni della texture generata (da ASSET_SIZE legacy, r. 181-184). */
  readonly size: readonly [number, number];
  /** Origine di default con cui le entità usano questa texture. */
  readonly origin: readonly [number, number];
  /** Generatore procedurale: placeholder finché non esiste il file reale. */
  readonly generator: TextureGenerator;
  /**
   * Per gli sprite futuri: se il file in assets/ è uno spritesheet, quanti
   * frame contiene e a che frame rate va animato. Le entità non cambiano.
   */
  readonly frames?: { readonly count: number; readonly rate: number };
}
