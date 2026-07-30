import Phaser from 'phaser';
import { GROUND, H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { RUN } from '../core/RunState';
import { SaveManager } from '../core/SaveManager';
import { IS_TOUCH } from '../input/device';
import { GamepadMenu } from '../input/GamepadMenu';
import { puff } from '../fx/particles';
import { T } from '../ui/text';
import { buildArena } from './arena';

/** La fiamma rinasce (port del legacy r. 962-985). */
export class VictoryScene extends Phaser.Scene {
  private inten = 0;

  constructor() {
    super('victory');
  }

  create(): void {
    const s = strings();
    buildArena(this, 2);
    this.add
      .image(W / 2, GROUND, 'brazier')
      .setOrigin(0.5, 1)
      .setDepth(2);
    this.inten = 0;
    this.time.addEvent({
      delay: 60,
      loop: true,
      callback: () => {
        this.inten = Math.min(1, this.inten + 0.012);
        const n = 1 + Math.floor(this.inten * 4);
        for (let i = 0; i < n; i++)
          puff(
            this,
            W / 2 + (Math.random() * 44 - 22) * Math.max(0.2, this.inten),
            GROUND - 40,
            Math.random() < 0.5 ? 0xff9a3c : 0xffd27a,
            1,
            20 + 40 * this.inten,
            700,
          );
      },
    });
    const t1 = T(this, W / 2, 140, s.victory.title, 52, '#ffb84d')
      .setDepth(2)
      .setAlpha(0);
    this.tweens.add({ targets: t1, alpha: 1, duration: 1400, delay: 1200 });
    const t2 = T(this, W / 2, 232, s.victory.epilogue, 19, '#e2d5b3', { lineSpacing: 10 })
      .setDepth(2)
      .setAlpha(0);
    this.tweens.add({ targets: t2, alpha: 1, duration: 1400, delay: 2600 });
    this.time.delayedCall(4200, () => {
      T(
        this,
        W / 2,
        H - 70,
        IS_TOUCH ? s.victory.backTouch : s.victory.backKey,
        15,
        '#8d7c5c',
      ).setDepth(2);
      let done = false;
      const back = (): void => {
        if (done) return;
        done = true;
        RUN.endRun();
        SaveManager.save();
        this.scene.start('title');
      };
      this.input.keyboard?.once('keydown-ENTER', back);
      this.input.once('pointerdown', back);
      new GamepadMenu(this, { confirm: back });
    });
  }
}
