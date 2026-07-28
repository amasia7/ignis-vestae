import Phaser from 'phaser';
import { TEXTURES, TEXTURE_KEYS } from '../registry';
import { queueRealAssets, generateMissingTextures, assetFileFor } from '../loadTextures';

/**
 * Anteprima di tutti gli asset, isolata dal gioco (`npm run art:preview`):
 * ogni texture del manifest su sfondo a scacchi, con chiave, dimensioni e
 * provenienza (GEN = generatore procedurale, FILE = assets/<chiave>.png).
 */
const COLS = 5;
const CELL_W = 220;
const CELL_H = 190;
const ROWS = Math.ceil(TEXTURE_KEYS.length / COLS);

class PreviewScene extends Phaser.Scene {
  preload(): void {
    queueRealAssets(this);
  }

  create(): void {
    generateMissingTextures(this);
    this.add
      .text(16, 12, `IGNIS VESTAE — asset registry (${TEXTURE_KEYS.length} texture)`, {
        fontFamily: 'Georgia, serif',
        fontSize: '20px',
        color: '#c9a227',
      })
      .setOrigin(0, 0);

    TEXTURE_KEYS.forEach((key, i) => {
      const entry = TEXTURES[key];
      const x = 10 + (i % COLS) * CELL_W;
      const y = 48 + Math.floor(i / COLS) * CELL_H;
      const [w, h] = entry.size;

      // sfondo a scacchi per leggere trasparenze e ingombri
      const g = this.add.graphics();
      const boxW = CELL_W - 20;
      const boxH = CELL_H - 56;
      g.fillStyle(0x201a2c, 1).fillRect(x, y, boxW, boxH);
      g.fillStyle(0x2a2338, 1);
      for (let cy = 0; cy < boxH; cy += 12) {
        for (let cx = cy % 24 === 0 ? 0 : 12; cx < boxW; cx += 24) {
          g.fillRect(x + cx, y + cy, Math.min(12, boxW - cx), Math.min(12, boxH - cy));
        }
      }
      g.lineStyle(1, 0x4a3f60, 1).strokeRect(x, y, boxW, boxH);

      const scale = Math.min(1, (boxW - 16) / w, (boxH - 16) / h);
      this.add
        .image(x + boxW / 2, y + boxH / 2, key)
        .setOrigin(0.5)
        .setScale(scale);

      const src = assetFileFor(key) === null ? 'GEN' : 'FILE';
      this.add.text(
        x,
        y + boxH + 6,
        `${key} — ${w}x${h} [${src}]\norigin ${entry.origin[0]},${entry.origin[1]}`,
        { fontFamily: 'monospace', fontSize: '12px', color: '#b9a97f', lineSpacing: 2 },
      );
    });
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'preview',
  width: 20 + COLS * CELL_W,
  height: 60 + ROWS * CELL_H,
  backgroundColor: '#14101c',
  scale: { mode: Phaser.Scale.NONE },
  scene: [PreviewScene],
});
