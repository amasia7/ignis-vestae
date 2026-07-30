import Phaser from 'phaser';
import { H, MENU_BG_COLOR, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { IS_TOUCH } from '../input/device';
import { GamepadMenu } from '../input/GamepadMenu';
import { beep } from '../fx/audio';
import { T } from '../ui/text';

/** Le tre pagine di prologo (port del legacy r. 763-780). */
export class LoreScene extends Phaser.Scene {
  private page = 0;
  private texts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super('lore');
  }

  create(): void {
    const s = strings();
    this.cameras.main.setBackgroundColor(MENU_BG_COLOR);
    this.page = 0;
    this.texts = [];
    this.showPage();
    T(this, W / 2, H - 70, IS_TOUCH ? s.lore.nextTouch : s.lore.nextKey, 16, '#9d8d70');
    const next = (): void => {
      beep(180, 0.1, 'sine', 0.04, 40);
      this.page++;
      if (this.page >= s.lore.pages.length) this.scene.start('level');
      else this.showPage();
    };
    this.input.keyboard?.on('keydown-ENTER', next);
    this.input.on('pointerdown', next);
    new GamepadMenu(this, { confirm: next });
  }

  private showPage(): void {
    this.texts.forEach((t) => t.destroy());
    this.texts = [];
    const page = strings().lore.pages[this.page] ?? [];
    page.forEach((line, i) => {
      const t = T(this, W / 2, H / 2 - 74 + i * 38, line, 23, '#e2d5b3').setAlpha(0);
      this.tweens.add({ targets: t, alpha: 1, duration: 400, delay: i * 120 });
      this.texts.push(t);
    });
  }
}
