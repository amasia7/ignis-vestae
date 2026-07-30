import Phaser from 'phaser';
import { H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { GamepadMenu } from '../input/GamepadMenu';
import { beep, initAudio } from '../fx/audio';
import { sceneMusic } from '../fx/music';
import { T } from '../ui/text';

interface MenuEntry {
  label: string;
  action: () => void;
}

/** Titolo: nero assoluto, il logo e il menu a voci. */
export class TitleScene extends Phaser.Scene {
  private entries: MenuEntry[] = [];
  private labels: Phaser.GameObjects.Text[] = [];
  private cursor = 0;

  constructor() {
    super('title');
  }

  create(): void {
    const s = strings();
    this.cameras.main.setBackgroundColor('#000000');

    // musica del menu: parte appena l'audio è sbloccato dal primo gesto;
    // resta accesa nei sottomenu, la cambia la prima scena di gioco
    sceneMusic(this, 'title');

    T(this, W / 2, 140, s.title.logo, 58, '#c9a227');
    T(this, W / 2, 182, s.title.subtitle, 18, '#8d7c5c');
    T(this, W / 2, 208, s.title.tagline, 14, '#6d6048');

    const overlay = (key: string): void => {
      this.scene.pause();
      this.scene.launch(key, { from: 'title' });
    };
    this.entries = [
      { label: s.menu.newGame, action: () => this.scene.start('slots', { mode: 'new' }) },
      { label: s.menu.continue, action: () => this.scene.start('slots', { mode: 'continue' }) },
      { label: s.menu.levels, action: () => this.scene.start('slots', { mode: 'levels' }) },
      { label: s.menu.settings, action: () => overlay('settings') },
      { label: s.menu.info, action: () => overlay('info') },
    ];

    this.labels = this.entries.map((entry, i) => {
      const t = T(this, W / 2, 288 + i * 36, entry.label, 20, '#a3927a');
      t.setInteractive({ useHandCursor: true });
      t.on('pointerover', () => this.pick(i));
      t.on('pointerdown', () => this.activate());
      return t;
    });
    this.pick(0, true);

    T(this, W / 2, H - 62, s.menu.hint, 13, '#6d6048');

    const k = this.input.keyboard;
    k?.on('keydown-UP', () =>
      this.pick((this.cursor + this.entries.length - 1) % this.entries.length),
    );
    k?.on('keydown-DOWN', () => this.pick((this.cursor + 1) % this.entries.length));
    k?.on('keydown-ENTER', () => this.activate());
    new GamepadMenu(this, {
      up: () => this.pick((this.cursor + this.entries.length - 1) % this.entries.length),
      down: () => this.pick((this.cursor + 1) % this.entries.length),
      confirm: () => this.activate(),
    });
  }

  private pick(i: number, silent = false): void {
    this.cursor = i;
    this.labels.forEach((t, j) => {
      const selected = j === i;
      t.setColor(selected ? '#e8cf7a' : '#a3927a');
      t.setText(selected ? `✦  ${this.entries[j]!.label}  ✦` : this.entries[j]!.label);
    });
    if (!silent) beep(260, 0.05, 'sine', 0.03, 0);
  }

  private activate(): void {
    initAudio();
    beep(320, 0.2, 'sine', 0.05, 100);
    this.entries[this.cursor]?.action();
  }
}
