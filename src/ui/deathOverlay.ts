import type Phaser from 'phaser';
import { H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { IS_TOUCH } from '../input/device';
import { beep } from '../fx/audio';
import { T } from './text';

/**
 * Schermata di morte condivisa da fight e livelli (port del legacy
 * r. 841-855): velo nero, testo per classe, retry su INVIO/R/tocco.
 * @param onArmed chiamata quando il retry diventa disponibile (per il gamepad)
 */
export function showDeathOverlay(
  scene: Phaser.Scene,
  classIdx: number,
  onRetry: () => void,
  onArmed?: () => void,
): void {
  beep(60, 0.8, 'sawtooth', 0.07, -30);
  const dark = scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0).setDepth(12);
  scene.tweens.add({ targets: dark, fillAlpha: 0.75, duration: 900 });
  const hud = scene.scene.get('hud') as { dim?: (a: number, d: number) => void } | null;
  hud?.dim?.(0.25, 900);
  const deathText = strings().classes[classIdx]?.death ?? '';
  const t = T(scene, W / 2, H / 2, deathText, 52, '#8e2f2f')
    .setDepth(13)
    .setAlpha(0);
  scene.tweens.add({ targets: t, alpha: 1, duration: 700, delay: 500 });
  scene.time.delayedCall(1200, () => {
    const s = strings();
    T(scene, W / 2, H / 2 + 48, IS_TOUCH ? s.fight.retryTouch : s.fight.retryKey, 15, '#a3927a')
      .setDepth(13)
      .setScrollFactor(0);
    onArmed?.();
    scene.input.keyboard?.once('keydown-ENTER', onRetry);
    scene.input.keyboard?.once('keydown-R', onRetry);
    scene.input.once('pointerdown', onRetry);
  });
  // il velo e il testo non devono scorrere con la camera dei livelli
  dark.setScrollFactor(0);
  t.setScrollFactor(0);
}
