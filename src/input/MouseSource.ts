import type Phaser from 'phaser';
import { RUN } from '../core/RunState';
import { CLASSES } from '../data/classes';
import type { Action } from './actions';
import type { InputSnapshot, InputSource } from './InputManager';

/**
 * Mouse sempre attivo in combattimento:
 *   sinistro  → ATTACK (tap = leggero, tieni premuto = pesante)
 *   destro    → SHIELD per le classi con scudo, ROLL per le leggere
 *   centrale  → QUICK_ITEM (oggetto rapido)
 */
export class MouseSource implements InputSource {
  private held = new Set<Action>();
  private just = new Set<Action>();

  constructor(scene: Phaser.Scene) {
    scene.input.mouse?.disableContextMenu();
    scene.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (p.leftButtonDown()) this.press('ATTACK');
      if (p.rightButtonDown()) this.press(this.defenseAction());
      if (p.middleButtonDown()) this.press('QUICK_ITEM');
    });
    scene.input.on('pointerup', (p: Phaser.Input.Pointer) => {
      if (p.leftButtonReleased()) this.held.delete('ATTACK');
      if (p.rightButtonReleased()) {
        this.held.delete('SHIELD');
        this.held.delete('ROLL');
      }
      if (p.middleButtonReleased()) this.held.delete('QUICK_ITEM');
    });
  }

  /** Destro: scudo per le classi pesanti, schivata per le leggere. */
  private defenseAction(): Action {
    return CLASSES[RUN.classIdx]?.hasShield ? 'SHIELD' : 'ROLL';
  }

  private press(action: Action): void {
    this.held.add(action);
    this.just.add(action);
  }

  poll(): InputSnapshot {
    const snap: InputSnapshot = { held: new Set(this.held), just: new Set(this.just) };
    this.just.clear();
    return snap;
  }
}
