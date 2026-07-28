import type Phaser from 'phaser';
import { settings } from '../core/settings';

/**
 * Shake della camera con gli stessi parametri del legacy, ma disattivabile
 * dalle impostazioni (unico punto in cui il gioco chiama camera.shake).
 */
export function shake(scene: Phaser.Scene, durationMs: number, intensity: number): void {
  if (!settings.screenShake) return;
  scene.cameras.main.shake(durationMs, intensity);
}
