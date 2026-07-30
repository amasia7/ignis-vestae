import Phaser from 'phaser';
import { GROUND, H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { RUN } from '../core/RunState';
import { SaveManager } from '../core/SaveManager';
import { IS_TOUCH } from '../input/device';
import { GamepadMenu } from '../input/GamepadMenu';
import { beep, initAudio } from '../fx/audio';
import { startTitleMusic, stopTitleMusic } from '../fx/music';
import { puff } from '../fx/particles';
import { T } from '../ui/text';

/** Schermata del titolo (port del legacy r. 692-713). */
export class TitleScene extends Phaser.Scene {
  constructor() {
    super('title');
  }

  create(): void {
    const s = strings();
    // richiesta del committente: nero assoluto, solo l'altare del fuoco
    this.cameras.main.setBackgroundColor('#000000');
    this.add
      .image(W / 2, GROUND, 'brazier')
      .setOrigin(0.5, 1)
      .setDepth(2);
    // alone caldo del fuoco sul nero
    const halo = this.add
      .image(W / 2, GROUND - 40, 'dot')
      .setTint(0xff7828)
      .setScale(30, 18)
      .setAlpha(0.06)
      .setDepth(1);
    this.tweens.add({
      targets: halo,
      alpha: 0.1,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });

    // musica d'intro: parte appena l'audio è sbloccato dal primo gesto
    startTitleMusic();
    const tryMusic = (): void => startTitleMusic();
    this.input.keyboard?.on('keydown', tryMusic);
    this.input.on('pointerdown', tryMusic);
    this.events.once('shutdown', () => stopTitleMusic());
    T(this, W / 2, 168, s.title.logo, 58, '#c9a227').setDepth(2);
    T(this, W / 2, 208, s.title.subtitle, 18, '#8d7c5c').setDepth(2);
    T(this, W / 2, 234, s.title.tagline, 14, '#8d7c5c').setDepth(2);
    const go = T(
      this,
      W / 2,
      330,
      IS_TOUCH ? s.title.startTouch : s.title.startKey,
      18,
      '#d8c9a3',
    ).setDepth(2);
    this.tweens.add({ targets: go, alpha: 0.15, duration: 600, yoyo: true, repeat: -1 });
    if (!IS_TOUCH) {
      T(this, W / 2, H - 84, s.title.hintControls, 14, '#a3927a').setDepth(2);
      T(this, W / 2, H - 62, s.title.hintRoll, 14, '#a3927a').setDepth(2);
    }
    this.time.addEvent({
      delay: 130,
      loop: true,
      callback: () => {
        puff(
          this,
          W / 2 + (Math.random() * 24 - 12),
          GROUND - 40,
          Math.random() < 0.5 ? 0xff9a3c : 0xffd27a,
          1,
          18,
          700,
        );
      },
    });
    // novità Fase 8: riprendi la run salvata e impostazioni
    if (SaveManager.hasRunInProgress()) {
      T(
        this,
        W / 2,
        362,
        s.title.continuePrefix + (s.arenas[RUN.bossIdx] ?? ''),
        14,
        '#8d7c5c',
      ).setDepth(2);
      this.input.keyboard?.on('keydown-C', () => {
        initAudio();
        beep(300, 0.2, 'sine', 0.05, 80);
        this.scene.start('level');
      });
    }
    T(this, W / 2, 388, s.title.settingsHint, 12, '#6d6048').setDepth(2);
    this.input.keyboard?.on('keydown-O', () => {
      this.scene.pause();
      this.scene.launch('settings', { from: 'title' });
    });

    const go2 = (): void => {
      initAudio();
      beep(220, 0.2, 'sine', 0.05, 60);
      this.scene.start('select');
    };
    this.input.keyboard?.on('keydown-ENTER', go2);
    this.input.on('pointerdown', go2);
    new GamepadMenu(this, { confirm: go2 });
  }
}
