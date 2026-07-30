import Phaser from 'phaser';
import { MENU_BG_COLOR, W } from '../config/game.config';
import { CLASSES, CLASS_STAT_MAX } from '../data/classes';
import { strings } from '../data/i18n';
import { RUN } from '../core/RunState';
import { SaveManager } from '../core/SaveManager';
import { IS_TOUCH } from '../input/device';
import { GamepadMenu } from '../input/GamepadMenu';
import { beep } from '../fx/audio';
import { T, textStyle } from '../ui/text';
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
    T(this, W / 2, 88, IS_TOUCH ? s.select.hintTouch : s.select.hintKeys, 14, '#a3927a');
    this.sel = RUN.classIdx;
    this.cards = [];

    for (let i = 0; i < CLASSES.length; i++) {
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
      // nome e sottotitolo in testa alla card, sopra la figura
      T(this, x0 + CARD_W / 2, CARD_Y0 + 28, cs.name, 19, '#e8cf7a');
      T(this, x0 + CARD_W / 2, CARD_Y0 + 52, cs.sub, 13, '#b3a284');
      this.add.image(x0 + CARD_W / 2, CARD_Y0 + 138, `pl${i}` as TextureKey).setScale(1.25);
      this.add
        .image(x0 + CARD_W / 2 + 20, CARD_Y0 + 138 - 30, `wp${i}` as TextureKey)
        .setOrigin(0.12, 0.5)
        .setRotation(-0.25);
      T(this, x0 + CARD_W / 2, CARD_Y0 + 208, cs.desc, 14, '#e2d5b3', {
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
        this.add.text(x0 + 18, sy, nm, textStyle(11, '#b3a284'));
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
        14,
        '#8fc5e8',
      );
      T(this, x0 + CARD_W / 2, CARD_Y0 + 372, cs.abilityDesc, 12, 'rgba(159,208,234,0.95)', {
        wordWrap: { width: CARD_W - 30 },
        fontStyle: 'italic',
      });
      this.cards.push({ bg });
    }

    this.hl = this.add.rectangle(0, 0, CARD_W, CARD_H).setStrokeStyle(2.5, 0xc9a227);
    this.pick(this.sel, true);
    const k = this.input.keyboard;
    k?.on('keydown-LEFT', () => this.pick((this.sel + CLASSES.length - 1) % CLASSES.length));
    k?.on('keydown-RIGHT', () => this.pick((this.sel + 1) % CLASSES.length));
    k?.on('keydown-ENTER', () => this.confirm());
    k?.on('keydown-A', () => this.confirm()); // A = colpo leggero, conferma anche qui
    new GamepadMenu(this, {
      left: () => this.pick((this.sel + CLASSES.length - 1) % CLASSES.length),
      right: () => this.pick((this.sel + 1) % CLASSES.length),
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
