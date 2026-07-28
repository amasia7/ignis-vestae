import Phaser from 'phaser';
import { H, MENU_BG_COLOR, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { IS_TOUCH } from '../input/device';
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
    T(this, W / 2, H - 70, IS_TOUCH ? s.lore.nextTouch : s.lore.nextKey, 15, '#6d6048');
    const next = (): void => {
      beep(180, 0.1, 'sine', 0.04, 40);
      this.page++;
      if (this.page >= s.lore.pages.length) this.scene.start('fight');
      else this.showPage();
    };
    this.input.keyboard?.on('keydown-ENTER', next);
    this.input.on('pointerdown', next);
  }

  private showPage(): void {
    this.texts.forEach((t) => t.destroy());
    this.texts = [];
    const page = strings().lore.pages[this.page] ?? [];
    page.forEach((line, i) => {
      const t = T(this, W / 2, H / 2 - 70 + i * 34, line, 20, '#c9b98f').setAlpha(0);
      this.tweens.add({ targets: t, alpha: 1, duration: 400, delay: i * 120 });
      this.texts.push(t);
    });
  }
}
