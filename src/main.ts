import Phaser from 'phaser';
import { PlaceholderScene } from './scenes/PlaceholderScene';

// Fase 1: configurazione identica al legacy (r. 988-995), con una sola scena vuota.
// W/H/GROUND e gravità migreranno in config/ nella Fase 2 insieme al resto dei dati.
const W = 960;
const H = 540;

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: W,
  height: H,
  backgroundColor: '#0b0810',
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 1500 }, debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { activePointers: 4 },
  scene: [PlaceholderScene],
});
