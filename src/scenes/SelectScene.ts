import Phaser from 'phaser';
import { MENU_BG_COLOR, W } from '../config/game.config';
import { CLASSES, CLASS_STAT_MAX } from '../data/classes';
import { strings } from '../data/i18n';
import { RUN } from '../core/RunState';
import { SaveManager } from '../core/SaveManager';
import { IS_TOUCH } from '../input/device';
import { GamepadMenu } from '../input/GamepadMenu';
import { beep } from '../fx/audio';
import { T } from '../ui/text';
import type { TextureKey } from '../art/registry';

const CARD_X0 = 38;
const CARD_STEP = 300;
const CARD_W = 284;
const CARD_Y0 = 112;
const CARD_H = 386;

/** Selezione della classe (port del legacy r. 715-761). */
export class SelectScene extends Phaser.Scene {
  private sel = 0;
  private cards: { bg: Phaser.GameObjects.Rectangle }[] = [];
  private hl!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('select');
  }

  create(): void {
    const s = strings();
    this.cameras.main.setBackgroundColor(MENU_BG_COLOR);
    T(this, W / 2, 56, s.select.heading, 30, '#c9a227');
    T(this, W / 2, 88, IS_TOUCH ? s.select.hintTouch : s.select.hintKeys, 13, '#7d6f57');
    this.sel = RUN.classIdx;
    this.cards = [];

    for (let i = 0; i < 3; i++) {
      const c = CLASSES[i]!;
      const cs = s.classes[i]!;
      const x0 = CARD_X0 + i * CARD_STEP;
      const bg = this.add.rectangle(
        x0 + CARD_W / 2,
        CARD_Y0 + CARD_H / 2,
        CARD_W,
        CARD_H,
        0x141020,
        0.75,
      );
      this.add
        .rectangle(x0 + CARD_W / 2, CARD_Y0 + CARD_H / 2, CARD_W, CARD_H)
        .setStrokeStyle(1, 0x3a3046);
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerdown', () => {
        if (this.sel === i) this.confirm();
        else this.pick(i);
      });
      this.add.image(x0 + CARD_W / 2, CARD_Y0 + 112, `pl${i}` as TextureKey).setScale(1.25);
      this.add
        .image(x0 + CARD_W / 2 + 20, CARD_Y0 + 112 - 30, `wp${i}` as TextureKey)
        .setOrigin(0.12, 0.5)
        .setRotation(-0.25);
      T(this, x0 + CARD_W / 2, CARD_Y0 + 150, cs.name, 16, '#a89877');
      T(this, x0 + CARD_W / 2, CARD_Y0 + 170, cs.sub, 12, '#8d7c5c');
      T(this, x0 + CARD_W / 2, CARD_Y0 + 206, cs.desc, 13, '#c9b98f', {
        wordWrap: { width: CARD_W - 34 },
        fontStyle: 'italic',
      });
      const stats: [string, number, number][] = [
        [s.select.statVigor, c.hp, CLASS_STAT_MAX.hp],
        [s.select.statStamina, c.stamina, CLASS_STAT_MAX.stamina],
        [s.select.statStrength, c.damageMult, CLASS_STAT_MAX.damageMult],
        [s.select.statSpeed, c.speed, CLASS_STAT_MAX.speed],
      ];
      const sg = this.add.graphics();
      stats.forEach(([nm, v, mx], j) => {
        const sy = CARD_Y0 + 252 + j * 23;
        this.add.text(x0 + 18, sy, nm, {
          fontFamily: 'Georgia, serif',
          fontSize: '10px',
          color: '#8d7c5c',
        });
        sg.fillStyle(0x000000, 0.5);
        sg.fillRect(x0 + 106, sy + 1, CARD_W - 126, 7);
        sg.fillStyle(0x6d5f3a, 1);
        sg.fillRect(x0 + 106, sy + 1, ((CARD_W - 126) * v) / mx, 7);
      });
      T(
        this,
        x0 + CARD_W / 2,
        CARD_Y0 + 352,
        s.select.abilityPrefix + cs.abilityName,
        13,
        '#7fb7d8',
      );
      T(this, x0 + CARD_W / 2, CARD_Y0 + 371, cs.abilityDesc, 11, 'rgba(127,183,216,0.75)', {
        wordWrap: { width: CARD_W - 30 },
        fontStyle: 'italic',
      });
      this.cards.push({ bg });
    }

    this.hl = this.add.rectangle(0, 0, CARD_W, CARD_H).setStrokeStyle(2.5, 0xc9a227);
    this.pick(this.sel, true);
    const k = this.input.keyboard;
    k?.on('keydown-LEFT', () => this.pick((this.sel + 2) % 3));
    k?.on('keydown-A', () => this.pick((this.sel + 2) % 3));
    k?.on('keydown-RIGHT', () => this.pick((this.sel + 1) % 3));
    k?.on('keydown-D', () => this.pick((this.sel + 1) % 3));
    k?.on('keydown-ENTER', () => this.confirm());
    k?.on('keydown-J', () => this.confirm());
    new GamepadMenu(this, {
      left: () => this.pick((this.sel + 2) % 3),
      right: () => this.pick((this.sel + 1) % 3),
      confirm: () => this.confirm(),
    });
  }

  private pick(i: number, silent = false): void {
    this.sel = i;
    this.hl.setPosition(CARD_X0 + i * CARD_STEP + CARD_W / 2, CARD_Y0 + CARD_H / 2);
    this.cards.forEach((c, j) =>
      c.bg.setFillStyle(j === i ? 0x3a2c14 : 0x141020, j === i ? 0.55 : 0.75),
    );
    if (!silent) beep(260, 0.05, 'sine', 0.03, 0);
  }

  private confirm(): void {
    RUN.startRun(this.sel);
    SaveManager.save();
    beep(320, 0.3, 'sine', 0.05, 120);
    this.scene.start('lore');
  }
}
