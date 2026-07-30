import Phaser from 'phaser';
import { H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { GamepadMenu } from '../input/GamepadMenu';
import { T } from '../ui/text';

/** Info: che cos'è il gioco, come si gioca, chi l'ha forgiato. */
export class InfoScene extends Phaser.Scene {
  constructor() {
    super('info');
  }

  create(): void {
    const s = strings();
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.88);
    this.add.rectangle(W / 2, H / 2, 640, 420, 0x0d0a14, 0.96).setStrokeStyle(1.5, 0x4a3c26);
    T(this, W / 2, H / 2 - 172, s.info.title, 26, '#c9a227');
    T(this, W / 2, H / 2 - 10, s.info.body, 15, '#d8cba3', {
      wordWrap: { width: 570 },
      lineSpacing: 6,
    });
    T(this, W / 2, H / 2 + 176, s.title.hintControls, 12, '#8d7c5c');

    const close = (): void => {
      this.scene.stop();
      this.scene.resume('title');
    };
    this.input.keyboard?.on('keydown-ESC', close);
    this.input.keyboard?.on('keydown-ENTER', close);
    this.input.on('pointerdown', close);
    new GamepadMenu(this, { confirm: close });
  }
}
