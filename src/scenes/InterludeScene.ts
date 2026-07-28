import Phaser from 'phaser';
import { GROUND, H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { RUN, BOSS_COUNT } from '../core/RunState';
import { SaveManager } from '../core/SaveManager';
import { IS_TOUCH } from '../input/device';
import { GamepadMenu } from '../input/GamepadMenu';
import { beep } from '../fx/audio';
import { puff } from '../fx/particles';
import { T } from '../ui/text';
import { buildArena } from './arena';

/** Interludio della reliquia recuperata (port del legacy r. 936-960). */
export class InterludeScene extends Phaser.Scene {
  constructor() {
    super('inter');
  }

  create(): void {
    const s = strings();
    buildArena(this, 2);
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.55).setDepth(1);
    this.add
      .image(W / 2, GROUND, 'brazier')
      .setOrigin(0.5, 1)
      .setDepth(2);
    const idx = RUN.bossIdx;
    const relic = s.relics[idx];
    if (!relic) throw new Error(`Reliquia inesistente: ${idx}`);
    this.time.addEvent({
      delay: 110,
      loop: true,
      callback: () => {
        for (let i = 0; i <= idx; i++)
          if (Math.random() < 0.7)
            puff(this, W / 2 + (Math.random() * 26 - 13), GROUND - 40, 0xff9a3c, 1, 16, 650);
      },
    });
    T(this, W / 2, 96, s.interlude.heading, 16, '#8d7c5c').setDepth(2);
    T(this, W / 2, 146, relic.title, 40, '#c9a227').setDepth(2);
    T(this, W / 2, 238, relic.desc, 17, '#c9b98f', {
      wordWrap: { width: 560 },
      fontStyle: 'italic',
      lineSpacing: 6,
    }).setDepth(2);
    T(this, W / 2, 352, relic.fx, 15, '#7fb7d8').setDepth(2);
    const go = T(
      this,
      W / 2,
      H - 84,
      IS_TOUCH ? s.interlude.nextTouch : s.interlude.nextKey,
      16,
      '#d8c9a3',
    ).setDepth(2);
    this.tweens.add({ targets: go, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });
    this.time.delayedCall(500, () => {
      let done = false;
      const next = (): void => {
        if (done) return;
        done = true;
        beep(300, 0.3, 'sine', 0.05, 150);
        RUN.advance();
        SaveManager.save();
        this.scene.start(RUN.bossIdx < BOSS_COUNT ? 'fight' : 'victory');
      };
      this.input.keyboard?.once('keydown-ENTER', next);
      this.input.once('pointerdown', next);
      new GamepadMenu(this, { confirm: next });
    });
  }
}
