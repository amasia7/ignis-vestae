import type Phaser from 'phaser';
import { H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import type { Action } from './actions';
import type { InputSnapshot, InputSource } from './InputManager';
import { IS_TOUCH } from './device';

interface PadButton {
  x: number;
  y: number;
  action: Action;
  label: string;
  small: boolean;
  hold: boolean;
}

/**
 * Pad touch, identico al legacy (r. 208-236): layout, alpha 0.38/0.72,
 * scivolamento del dito tra ◀ e ▶ (pointerover con pointer premuto).
 * Espone azioni astratte come le altre sorgenti.
 */
export class VirtualPad implements InputSource {
  private held = new Set<Action>();
  private just = new Set<Action>();

  constructor(scene: Phaser.Scene) {
    if (!IS_TOUCH) return;
    const vp = strings().vpad;
    const buttons: PadButton[] = [
      { x: 72, y: H - 54, action: 'MOVE_LEFT', label: vp.left, small: false, hold: true },
      { x: 156, y: H - 54, action: 'MOVE_RIGHT', label: vp.right, small: false, hold: true },
      { x: W - 88, y: H - 54, action: 'LIGHT', label: vp.light, small: false, hold: false },
      { x: W - 166, y: H - 54, action: 'ROLL', label: vp.roll, small: false, hold: false },
      { x: W - 244, y: H - 54, action: 'JUMP', label: vp.jump, small: false, hold: false },
      { x: W - 88, y: H - 128, action: 'HEAVY', label: vp.heavy, small: true, hold: false },
      { x: W - 158, y: H - 128, action: 'ABILITY', label: vp.ability, small: true, hold: false },
      { x: W - 228, y: H - 128, action: 'HEAL', label: vp.heal, small: true, hold: false },
    ];
    for (const b of buttons) this.makeButton(scene, b);
  }

  private makeButton(scene: Phaser.Scene, b: PadButton): void {
    const img = scene.add
      .image(b.x, b.y, b.small ? 'btnsm' : 'btn')
      .setAlpha(0.38)
      .setDepth(20)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: false });
    scene.add
      .text(b.x, b.y, b.label, {
        fontFamily: 'Georgia, serif',
        fontSize: b.small ? '17px' : '23px',
        color: '#e8d9a8',
      })
      .setOrigin(0.5)
      .setDepth(20)
      .setAlpha(0.85);
    const press = (): void => {
      img.setAlpha(0.72);
      if (b.hold) this.held.add(b.action);
      else this.just.add(b.action);
    };
    const release = (): void => {
      img.setAlpha(0.38);
      if (b.hold) this.held.delete(b.action);
    };
    img.on('pointerdown', press);
    img.on('pointerup', release);
    img.on('pointerout', release);
    // il dito può scivolare tra ◀ e ▶ senza rilasciare (legacy r. 224)
    img.on('pointerover', (p: Phaser.Input.Pointer) => {
      if (p.isDown) press();
    });
  }

  poll(): InputSnapshot {
    const snap: InputSnapshot = { held: new Set(this.held), just: new Set(this.just) };
    this.just.clear();
    return snap;
  }
}
