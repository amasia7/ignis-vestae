import { settings } from '../core/settings';
import type { Action } from './actions';

/**
 * Mappatura azione → nomi tasto (Phaser.Input.Keyboard.KeyCodes).
 * Default identici al legacy (r. 240-251); rimappabili dalle impostazioni
 * (gli override vivono in settings.bindings e sono persistiti).
 */
export type KeyBindings = Record<Action, readonly string[]>;

export const DEFAULT_BINDINGS: KeyBindings = {
  MOVE_LEFT: ['A', 'LEFT'],
  MOVE_RIGHT: ['D', 'RIGHT'],
  JUMP: ['W', 'UP'],
  ROLL: ['K', 'SPACE'],
  LIGHT: ['J'],
  HEAVY: ['L'],
  HEAL: ['H'],
  ABILITY: ['U'],
  CONFIRM: ['ENTER'],
  PAUSE: ['ESC'],
};

/** Binding correnti: default + override dell'utente. */
export function currentBindings(): KeyBindings {
  return { ...DEFAULT_BINDINGS, ...settings.bindings };
}

export function keysFor(action: Action): readonly string[] {
  return currentBindings()[action];
}
