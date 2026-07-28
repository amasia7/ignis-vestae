import type Phaser from 'phaser';
import type { Action } from './actions';
import type { InputSnapshot, InputSource } from './InputManager';

/** Soglia dello stick analogico. */
const AXIS_THRESHOLD = 0.35;

/** Mappatura standard-gamepad → azioni (nuova: il legacy non aveva gamepad). */
const BUTTON_ACTIONS: ReadonlyArray<readonly [number, Action]> = [
  [0, 'JUMP'], // A / Cross
  [0, 'CONFIRM'],
  [2, 'LIGHT'], // X / Square
  [3, 'HEAVY'], // Y / Triangle
  [1, 'ROLL'], // B / Circle
  [5, 'ROLL'], // RB
  [4, 'HEAL'], // LB
  [7, 'ABILITY'], // RT
  [6, 'ABILITY'], // LT
  [9, 'PAUSE'], // Start
];

export class GamepadSource implements InputSource {
  private prevPressed = new Set<number>();
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  poll(): InputSnapshot {
    const held = new Set<Action>();
    const just = new Set<Action>();
    const pad = this.scene.input.gamepad?.getPad(0);
    if (!pad) {
      this.prevPressed.clear();
      return { held, just };
    }

    const axisX = pad.axes.length > 0 ? pad.axes[0]!.getValue() : 0;
    if (axisX < -AXIS_THRESHOLD || pad.left) held.add('MOVE_LEFT');
    if (axisX > AXIS_THRESHOLD || pad.right) held.add('MOVE_RIGHT');

    const pressed = new Set<number>();
    pad.buttons.forEach((btn, idx) => {
      if (btn.pressed) pressed.add(idx);
    });
    for (const [idx, action] of BUTTON_ACTIONS) {
      if (pressed.has(idx)) {
        held.add(action);
        if (!this.prevPressed.has(idx)) just.add(action);
      }
    }
    this.prevPressed = pressed;
    return { held, just };
  }
}
