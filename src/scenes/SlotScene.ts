import Phaser from 'phaser';
import { H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { SaveManager, SLOT_COUNT } from '../core/SaveManager';
import { RUN } from '../core/RunState';
import { LEVELS_PER_WORLD, WORLD_COUNT, roman } from '../data/worlds';
import { GamepadMenu } from '../input/GamepadMenu';
import { beep } from '../fx/audio';
import { T } from '../ui/text';

type SlotMode = 'new' | 'continue' | 'levels';

/** Scelta di uno dei tre sigilli (slot di salvataggio). */
export class SlotScene extends Phaser.Scene {
  private mode: SlotMode = 'new';
  private cursor = 0;
  private overwriteArmed = -1;
  private rows: Phaser.GameObjects.Text[] = [];
  private note!: Phaser.GameObjects.Text;

  constructor() {
    super('slots');
  }

  init(data: { mode?: SlotMode }): void {
    this.mode = data.mode ?? 'new';
  }

  create(): void {
    const s = strings();
    this.cameras.main.setBackgroundColor('#000000');
    this.cursor = 0;
    this.overwriteArmed = -1;
    const title =
      this.mode === 'new'
        ? s.slots.titleNew
        : this.mode === 'continue'
          ? s.slots.titleContinue
          : s.slots.titleLevels;
    T(this, W / 2, 92, title, 26, '#c9a227');
    T(this, W / 2, 124, s.slots.hint, 13, '#8d7c5c');

    this.rows = [];
    for (let i = 0; i < SLOT_COUNT; i++) {
      const t = T(this, W / 2, 210 + i * 74, this.rowText(i), 17, '#a3927a');
      t.setInteractive({ useHandCursor: true });
      t.on('pointerover', () => this.pick(i));
      t.on('pointerdown', () => this.activate());
      this.rows.push(t);
    }
    this.note = T(this, W / 2, H - 92, '', 14, '#c9694a');
    this.pick(0, true);

    const k = this.input.keyboard;
    k?.on('keydown-UP', () => this.pick((this.cursor + SLOT_COUNT - 1) % SLOT_COUNT));
    k?.on('keydown-DOWN', () => this.pick((this.cursor + 1) % SLOT_COUNT));
    k?.on('keydown-ENTER', () => this.activate());
    k?.on('keydown-ESC', () => this.scene.start('title'));
    new GamepadMenu(this, {
      up: () => this.pick((this.cursor + SLOT_COUNT - 1) % SLOT_COUNT),
      down: () => this.pick((this.cursor + 1) % SLOT_COUNT),
      confirm: () => this.activate(),
    });
  }

  private rowText(i: number): string {
    const s = strings();
    const sum = SaveManager.summary(i);
    const head = `${s.slots.slot} ${roman(i + 1)}`;
    if (!sum.exists) return `${head}  —  ${s.slots.empty}`;
    const cls = s.classes[sum.classIdx]?.name ?? '';
    const world = Math.min(sum.bossIdx, WORLD_COUNT - 1);
    const spot =
      sum.levelIdx >= LEVELS_PER_WORLD
        ? (s.bosses[(['equus', 'cornelia', 'palladio'] as const)[world]!]?.name ?? '')
        : `${s.levelSelect.path} ${roman(sum.levelIdx + 1)}`;
    return `${head}  —  ${cls} · ${s.levelSelect.world} ${roman(world + 1)} · ${spot} · ✦ ${sum.relics}/${WORLD_COUNT}`;
  }

  private pick(i: number, silent = false): void {
    this.cursor = i;
    if (this.overwriteArmed !== i) {
      this.overwriteArmed = -1;
      this.note.setText('');
    }
    this.rows.forEach((t, j) => t.setColor(j === i ? '#e8cf7a' : '#a3927a'));
    if (!silent) beep(260, 0.05, 'sine', 0.03, 0);
  }

  private activate(): void {
    const s = strings();
    const sum = SaveManager.summary(this.cursor);
    if (this.mode === 'new') {
      if (sum.exists && this.overwriteArmed !== this.cursor) {
        this.overwriteArmed = this.cursor;
        this.note.setText(s.slots.overwrite);
        beep(150, 0.1, 'square', 0.04, -40);
        return;
      }
      SaveManager.setActiveSlot(this.cursor);
      beep(320, 0.25, 'sine', 0.05, 120);
      this.scene.start('select');
      return;
    }
    if (!sum.exists) {
      beep(110, 0.12, 'square', 0.04, -50);
      return;
    }
    SaveManager.loadSlot(this.cursor);
    beep(320, 0.25, 'sine', 0.05, 120);
    if (this.mode === 'levels') this.scene.start('levelselect');
    else this.scene.start(RUN.levelIdx >= LEVELS_PER_WORLD ? 'fight' : 'level');
  }
}
