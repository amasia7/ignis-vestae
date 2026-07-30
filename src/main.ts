import Phaser from 'phaser';
import { ACTIVE_POINTERS, BG_COLOR, GRAVITY_Y, H, W } from './config/game.config';
import { strings } from './data/i18n';
import { installAudioUnlock } from './fx/audio';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { SelectScene } from './scenes/SelectScene';
import { LoreScene } from './scenes/LoreScene';
import { FightScene } from './scenes/FightScene';
import { HudScene } from './scenes/HudScene';
import { InterludeScene } from './scenes/InterludeScene';
import { VictoryScene } from './scenes/VictoryScene';
import { LevelScene } from './scenes/LevelScene';
import { InventoryScene } from './scenes/InventoryScene';
import { PauseScene } from './scenes/PauseScene';
import { SettingsScene } from './scenes/SettingsScene';
// @scaffold:scene-import
import { SaveManager } from './core/SaveManager';

// Carica salvataggio e impostazioni prima di avviare il gioco
SaveManager.load();

// Testi dell'overlay "ruota il telefono" (r. 18 legacy) dal bundle i18n
const rot = document.getElementById('rot');
if (rot) {
  const s = strings().meta;
  rot.innerHTML = `⟳<br><br>${s.rotate}<br><span style="font-size:13px;color:#8d7c5c">${s.rotateSub}</span>`;
}
document.title = strings().meta.htmlTitle;

installAudioUnlock();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: W,
  height: H,
  backgroundColor: BG_COLOR,
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: GRAVITY_Y }, debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { activePointers: ACTIVE_POINTERS, gamepad: true },
  scene: [
    BootScene,
    TitleScene,
    SelectScene,
    LoreScene,
    FightScene,
    HudScene,
    InterludeScene,
    VictoryScene,
    LevelScene,
    InventoryScene,
    PauseScene,
    SettingsScene,
    // @scaffold:scene-list
  ],
});

// Solo in dev: aggancio per test end-to-end e debug da console.
// import.meta.env.DEV è false in produzione: il blocco viene eliminato.
if (import.meta.env.DEV) {
  (window as unknown as { __IGNIS?: Phaser.Game }).__IGNIS = game;
}
