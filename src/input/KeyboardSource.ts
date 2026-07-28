import Phaser from 'phaser';
import type { Action } from './actions';
import { ACTIONS } from './actions';
import { currentBindings } from './bindings';
import type { InputSnapshot, InputSource } from './InputManager';

const KEY_CODES = Phaser.Input.Keyboard.KeyCodes as unknown as Record<string, number>;

/** Sorgente tastiera: risolve i binding correnti in oggetti Key di Phaser. */
export class KeyboardSource implements InputSource {
  private keys = new Map<Action, Phaser.Input.Keyboard.Key[]>();
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.rebuild();
  }

  /** Da richiamare dopo una rimappatura. */
  rebuild(): void {
    const kb = this.scene.input.keyboard;
    if (!kb) return;
    for (const keys of this.keys.values()) for (const k of keys) kb.removeKey(k);
    this.keys.clear();
    const bindings = currentBindings();
    for (const action of ACTIONS) {
      const list: Phaser.Input.Keyboard.Key[] = [];
      for (const name of bindings[action]) {
        const code = KEY_CODES[name];
        if (code !== undefined) list.push(kb.addKey(code));
      }
      this.keys.set(action, list);
    }
  }

  poll(): InputSnapshot {
    const held = new Set<Action>();
    const just = new Set<Action>();
    for (const [action, keys] of this.keys) {
      for (const key of keys) {
        if (key.isDown) held.add(action);
        // JustDown consuma il flag del singolo tasto: va chiamato per ogni
        // tasto, senza corto circuito (docs/KNOWN-ISSUES.md §2).
        if (Phaser.Input.Keyboard.JustDown(key)) just.add(action);
      }
    }
    return { held, just };
  }
}
