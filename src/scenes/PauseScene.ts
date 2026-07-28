import Phaser from 'phaser';
import { H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { RUN } from '../core/RunState';
import { GamepadMenu } from '../input/GamepadMenu';
import { T } from '../ui/text';

/** Pausa con ESC sopra la FightScene (novità Fase 8). */
export class PauseScene extends Phaser.Scene {
  constructor() {
    super('pause');
  }

  create(): void {
    const s = strings();
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.62);
    T(this, W / 2, H / 2 - 78, s.pause.title, 42, '#c9a227');
    T(this, W / 2, H / 2 - 4, s.pause.resume, 16, '#d8c9a3');
    T(this, W / 2, H / 2 + 28, s.pause.settings, 16, '#8d7c5c');
    T(this, W / 2, H / 2 + 60, s.pause.quit, 16, '#8d7c5c');

    const resume = (): void => {
      this.scene.stop();
      this.scene.resume('fight');
    };
    const k = this.input.keyboard;
    k?.on('keydown-ESC', resume);
    k?.on('keydown-ENTER', resume);
    k?.on('keydown-O', () => {
      this.scene.stop();
      this.scene.launch('settings', { from: 'pause' });
    });
    k?.on('keydown-T', () => {
      RUN.endRun();
      this.scene.stop();
      this.scene.stop('fight'); // spegne anche l'HUD via shutdown
      this.scene.start('title');
    });
    new GamepadMenu(this, { confirm: resume });
  }
}
