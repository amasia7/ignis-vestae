import type Phaser from 'phaser';

interface MenuHandlers {
  confirm?: () => void;
  left?: () => void;
  right?: () => void;
  up?: () => void;
  down?: () => void;
}

/**
 * Navigazione dei menu con il gamepad (novità: il legacy non lo supporta).
 * Bottone A/Cross = conferma, d-pad o stick = direzioni, con edge detection.
 */
export class GamepadMenu {
  private prevButtons = new Set<number>();
  private prevAxis = { x: 0, y: 0 };

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly handlers: MenuHandlers,
  ) {
    scene.events.on('update', this.poll, this);
    scene.events.once('shutdown', () => scene.events.off('update', this.poll, this));
  }

  private poll(): void {
    const pad = this.scene.input.gamepad?.getPad(0);
    if (!pad) {
      this.prevButtons.clear();
      return;
    }
    const pressed = new Set<number>();
    pad.buttons.forEach((b, i) => {
      if (b.pressed) pressed.add(i);
    });
    const just = (i: number): boolean => pressed.has(i) && !this.prevButtons.has(i);
    const ax = pad.axes.length > 0 ? pad.axes[0]!.getValue() : 0;
    const ay = pad.axes.length > 1 ? pad.axes[1]!.getValue() : 0;

    if (just(0)) this.handlers.confirm?.();
    if (just(14) || (ax < -0.5 && this.prevAxis.x >= -0.5)) this.handlers.left?.();
    if (just(15) || (ax > 0.5 && this.prevAxis.x <= 0.5)) this.handlers.right?.();
    if (just(12) || (ay < -0.5 && this.prevAxis.y >= -0.5)) this.handlers.up?.();
    if (just(13) || (ay > 0.5 && this.prevAxis.y <= 0.5)) this.handlers.down?.();

    this.prevButtons = pressed;
    this.prevAxis = { x: ax, y: ay };
  }
}
