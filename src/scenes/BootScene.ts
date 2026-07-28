import Phaser from 'phaser';
import { generateMissingTextures, queueRealAssets } from '../art/loadTextures';

/**
 * Boot: carica gli eventuali asset reali da assets/ (vincono sul generatore),
 * poi genera le texture procedurali mancanti e avvia il titolo.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload(): void {
    queueRealAssets(this);
  }

  create(): void {
    generateMissingTextures(this);
    this.scene.start('title');
  }
}
