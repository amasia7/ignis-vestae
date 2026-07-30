import Phaser from 'phaser';
import { H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { ACTIONS, type Action } from '../input/actions';
import { currentBindings } from '../input/bindings';
import { applySettings, settings } from '../core/settings';
import { SaveManager } from '../core/SaveManager';
import { RUN } from '../core/RunState';
import { gameEvents } from '../core/EventBus';
import { GamepadMenu } from '../input/GamepadMenu';
import { beep } from '../fx/audio';
import { T } from '../ui/text';

const KEY_CODES = Phaser.Input.Keyboard.KeyCodes as unknown as Record<string, number>;

type Row =
  { kind: 'volume' } | { kind: 'shake' } | { kind: 'binding'; action: Action } | { kind: 'reset' };

/** Impostazioni: volume, shake, rimappatura tasti, reset (novità Fase 8). */
export class SettingsScene extends Phaser.Scene {
  private from = 'title';
  private pauseTarget = 'fight';
  private rows: Row[] = [];
  private cursor = 0;
  private labels: Phaser.GameObjects.Text[] = [];
  private values: Phaser.GameObjects.Text[] = [];
  private capturing = false;
  private resetFlash = 0;

  constructor() {
    super('settings');
  }

  init(data: { from?: string; target?: string }): void {
    this.from = data.from ?? 'title';
    this.pauseTarget = data.target ?? 'fight';
  }

  create(): void {
    const s = strings().settingsUi;
    this.cursor = 0;
    this.capturing = false;
    this.resetFlash = 0;
    this.labels = [];
    this.values = [];
    this.rows = [
      { kind: 'volume' },
      { kind: 'shake' },
      ...ACTIONS.map((action): Row => ({ kind: 'binding', action })),
      { kind: 'reset' },
    ];

    this.add.rectangle(W / 2, H / 2, W, H, 0x060409, 0.96);
    T(this, W / 2, 40, s.title, 28, '#c9a227');
    T(this, W / 2, 68, s.hint, 12, '#7d6f57');

    const x0 = W / 2 - 240;
    const x1 = W / 2 + 240;
    this.rows.forEach((row, i) => {
      const y = 100 + i * 26;
      const label = this.add
        .text(x0, y, this.rowLabel(row), {
          fontFamily: 'Georgia, serif',
          fontSize: '14px',
          color: '#a89877',
        })
        .setOrigin(0, 0.5);
      const value = this.add
        .text(x1, y, '', { fontFamily: 'Georgia, serif', fontSize: '14px', color: '#d8c9a3' })
        .setOrigin(1, 0.5);
      this.labels.push(label);
      this.values.push(value);
    });

    // tempi migliori per boss
    const bs = strings().bosses;
    const names = [bs.equus.name, bs.cornelia.name, bs.palladio.name];
    const times = RUN.bestTimesMs
      .map((t, i) => `${names[i]}: ${t == null ? s.noTime : formatMs(t)}`)
      .join('   ·   ');
    T(this, W / 2, H - 40, `${s.bestTimes}  —  ${times}`, 12, '#6d6048');

    this.refresh();

    const k = this.input.keyboard;
    k?.on('keydown', (e: KeyboardEvent) => this.onKey(e));
    new GamepadMenu(this, {
      up: () => this.move(-1),
      down: () => this.move(1),
      left: () => this.adjust(-1),
      right: () => this.adjust(1),
      confirm: () => this.activate(),
    });
  }

  private rowLabel(row: Row): string {
    const s = strings().settingsUi;
    if (row.kind === 'volume') return s.volume;
    if (row.kind === 'shake') return s.shake;
    if (row.kind === 'reset') return s.resetSave;
    return `${s.bindingsHeader} · ${s.actions[row.action]}`;
  }

  private onKey(e: KeyboardEvent): void {
    if (this.capturing) {
      this.captureKey(e);
      return;
    }
    switch (e.key) {
      case 'ArrowUp':
        this.move(-1);
        break;
      case 'ArrowDown':
        this.move(1);
        break;
      case 'ArrowLeft':
        this.adjust(-1);
        break;
      case 'ArrowRight':
        this.adjust(1);
        break;
      case 'Enter':
        this.activate();
        break;
      case 'Escape':
        this.close();
        break;
    }
  }

  private move(dir: number): void {
    this.cursor = (this.cursor + dir + this.rows.length) % this.rows.length;
    beep(260, 0.04, 'sine', 0.02, 0);
    this.refresh();
  }

  private adjust(dir: number): void {
    const row = this.rows[this.cursor];
    if (!row) return;
    if (row.kind === 'volume') {
      applySettings({ volume: Math.round((settings.volume + dir * 0.1) * 10) / 10 });
      beep(440, 0.06, 'sine', 0.04, 0);
    } else if (row.kind === 'shake') {
      applySettings({ screenShake: !settings.screenShake });
    } else return;
    this.persist();
    this.refresh();
  }

  private activate(): void {
    const row = this.rows[this.cursor];
    if (!row) return;
    if (row.kind === 'binding') {
      this.capturing = true;
      this.refresh();
    } else if (row.kind === 'reset') {
      SaveManager.reset();
      this.resetFlash = this.time.now + 1500;
      beep(120, 0.3, 'square', 0.05, -40);
      this.refresh();
    } else if (row.kind === 'shake') {
      this.adjust(1);
    }
  }

  private captureKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.capturing = false;
      this.refresh();
      return;
    }
    const name = Object.keys(KEY_CODES).find((n) => KEY_CODES[n] === e.keyCode);
    const row = this.rows[this.cursor];
    if (name && row && row.kind === 'binding') {
      applySettings({ bindings: { ...settings.bindings, [row.action]: [name] } });
      this.persist();
    }
    this.capturing = false;
    this.refresh();
  }

  private persist(): void {
    SaveManager.save();
    gameEvents.emit('settings:changed', settings);
  }

  private refresh(): void {
    const s = strings().settingsUi;
    const bindings = currentBindings();
    this.rows.forEach((row, i) => {
      const selected = i === this.cursor;
      this.labels[i]?.setColor(selected ? '#e8cf7a' : '#a89877');
      let value = '';
      if (row.kind === 'volume') value = `${Math.round(settings.volume * 100)}%`;
      else if (row.kind === 'shake') value = settings.screenShake ? s.on : s.off;
      else if (row.kind === 'binding')
        value = selected && this.capturing ? s.pressKey : bindings[row.action].join(' / ');
      else if (row.kind === 'reset') value = this.resetFlash > this.time.now ? s.resetDone : '';
      this.values[i]?.setText(value).setColor(selected ? '#e8cf7a' : '#d8c9a3');
    });
  }

  private close(): void {
    this.scene.stop();
    if (this.from === 'pause') this.scene.launch('pause', { target: this.pauseTarget });
    else this.scene.resume('title');
  }
}

function formatMs(ms: number): string {
  const s = ms / 1000;
  const m = Math.floor(s / 60);
  const r = (s - m * 60).toFixed(1);
  return m > 0 ? `${m}:${r.padStart(4, '0')}` : `${r}s`;
}
