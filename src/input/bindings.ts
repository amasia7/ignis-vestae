import { settings } from '../core/settings';
import type { Action } from './actions';

/**
 * Mappatura azione → nomi tasto (Phaser.Input.Keyboard.KeyCodes).
 * Schema attuale: frecce per muoversi e saltare, A attacco (tap = leggero,
 * tieni premuto = pesante), Q scudo, S schivata, E abilità, H ampolla,
 * F oggetto rapido, C scorri oggetti, B borsa. Il mouse è sempre attivo:
 * sinistro attacco, destro schivata/scudo (per classe), rotella oggetto.
 * Rimappabili dalle impostazioni (override in settings.bindings, persistiti).
 */
export type KeyBindings = Record<Action, readonly string[]>;

export const DEFAULT_BINDINGS: KeyBindings = {
  MOVE_LEFT: ['LEFT'],
  MOVE_RIGHT: ['RIGHT'],
  JUMP: ['UP'],
  ATTACK: ['A'],
  SHIELD: ['Q'],
  ROLL: ['S'],
  HEAL: ['H'],
  ABILITY: ['E'],
  QUICK_ITEM: ['F'],
  CYCLE_ITEM: ['C'],
  INVENTORY: ['B', 'I'],
  CONFIRM: ['ENTER'],
  PAUSE: ['ESC'],
};

/** Etichetta compatta di un tasto per l'HUD (frecce come simboli). */
export function keyLabel(name: string): string {
  const symbols: Record<string, string> = {
    LEFT: '◀',
    RIGHT: '▶',
    UP: '↑',
    DOWN: '↓',
    SPACE: 'SPAZIO',
    ENTER: 'INVIO',
    ESC: 'ESC',
  };
  return symbols[name] ?? name;
}

export function actionKeyLabel(action: Action): string {
  return currentBindings()
    [action].map((k) => keyLabel(k))
    .join('/');
}

/** Binding correnti: default + override dell'utente. */
export function currentBindings(): KeyBindings {
  return { ...DEFAULT_BINDINGS, ...settings.bindings };
}

export function keysFor(action: Action): readonly string[] {
  return currentBindings()[action];
}
