import Phaser from 'phaser';

/**
 * Scena vuota della Fase 1: dimostra solo che canvas, scale mode e pipeline
 * funzionano. Verrà sostituita dalle scene reali a partire dalla Fase 3/7.
 */
export class PlaceholderScene extends Phaser.Scene {
  constructor() {
    super('placeholder');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add
      .text(width / 2, height / 2 - 20, 'IGNIS  VESTAE', {
        fontFamily: 'Georgia, serif',
        fontSize: '58px',
        color: '#c9a227',
      })
      .setOrigin(0.5);
    this.add
      .text(width / 2, height / 2 + 28, 'migrazione in corso — Fase 1', {
        fontFamily: 'Georgia, serif',
        fontSize: '16px',
        color: '#8d7c5c',
      })
      .setOrigin(0.5);
  }
}
