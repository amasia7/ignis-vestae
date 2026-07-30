import Phaser from 'phaser';
import { H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { RUN } from '../core/RunState';
import { LEVELS_PER_WORLD, WORLD_COUNT, roman } from '../data/worlds';
import { GamepadMenu } from '../input/GamepadMenu';
import { beep } from '../fx/audio';
import { T } from '../ui/text';

/** Rigioca i cammini completati del sigillo scelto. */
export class LevelSelectScene extends Phaser.Scene {
  private choices: { world: number; level: number }[] = [];
  private cells: Phaser.GameObjects.Text[] = [];
  private cursor = 0;

  constructor() {
    super('levelselect');
  }

  create(): void {
    const s = strings();
    this.cameras.main.setBackgroundColor('#000000');
    T(this, W / 2, 84, s.levelSelect.title, 26, '#c9a227');
    T(this, W / 2, 116, s.levelSelect.hint, 13, '#8d7c5c');

    this.choices = [];
    this.cells = [];
    for (let w = 0; w < WORLD_COUNT; w++) {
      const y = 200 + w * 90;
      T(this, 180, y, `${s.levelSelect.world} ${roman(w + 1)}`, 18, '#b3a284');
      for (let l = 0; l < LEVELS_PER_WORLD; l++) {
        const done = RUN.isLevelCompleted(w, l);
        const x = 330 + l * 110;
        const cell = T(this, x, y, roman(l + 1), 20, done ? '#a3927a' : '#3a332a');
        if (done) {
          const idx = this.choices.length;
          this.choices.push({ world: w, level: l });
          this.cells.push(cell);
          cell.setInteractive({ useHandCursor: true });
          cell.on('pointerover', () => this.pick(idx));
          cell.on('pointerdown', () => this.activate());
        }
      }
    }

    if (this.choices.length === 0) T(this, W / 2, H - 120, s.levelSelect.none, 15, '#8d7c5c');
    else this.pick(0, true);

    const move = (dir: number): void => {
      if (this.choices.length === 0) return;
      this.pick((this.cursor + dir + this.choices.length) % this.choices.length);
    };
    const k = this.input.keyboard;
    k?.on('keydown-LEFT', () => move(-1));
    k?.on('keydown-RIGHT', () => move(1));
    k?.on('keydown-UP', () => move(-LEVELS_PER_WORLD));
    k?.on('keydown-DOWN', () => move(LEVELS_PER_WORLD));
    k?.on('keydown-ENTER', () => this.activate());
    k?.on('keydown-ESC', () => this.scene.start('title'));
    new GamepadMenu(this, {
      left: () => move(-1),
      right: () => move(1),
      up: () => move(-LEVELS_PER_WORLD),
      down: () => move(LEVELS_PER_WORLD),
      confirm: () => this.activate(),
    });
  }

  private pick(i: number, silent = false): void {
    this.cursor = i;
    this.cells.forEach((c, j) => c.setColor(j === i ? '#e8cf7a' : '#a3927a'));
    if (!silent) beep(260, 0.05, 'sine', 0.03, 0);
  }

  private activate(): void {
    const choice = this.choices[this.cursor];
    if (!choice) return;
    RUN.replay = { world: choice.world, level: choice.level };
    beep(320, 0.25, 'sine', 0.05, 120);
    this.scene.start('level');
  }
}
