/** Le azioni astratte del gioco: le entità non leggono mai un tasto. */
export type Action =
  | 'MOVE_LEFT'
  | 'MOVE_RIGHT'
  | 'JUMP'
  | 'ATTACK' // tap = colpo leggero, tieni premuto = pesante
  | 'SHIELD' // parata (classi con scudo)
  | 'ROLL'
  | 'HEAL'
  | 'ABILITY'
  | 'QUICK_ITEM' // usa l'oggetto rapido (rotella del mouse / F)
  | 'CYCLE_ITEM' // scorri gli oggetti rapidi (C)
  | 'INVENTORY'
  | 'CONFIRM'
  | 'PAUSE';

export const ACTIONS: readonly Action[] = [
  'MOVE_LEFT',
  'MOVE_RIGHT',
  'JUMP',
  'ATTACK',
  'SHIELD',
  'ROLL',
  'HEAL',
  'ABILITY',
  'QUICK_ITEM',
  'CYCLE_ITEM',
  'INVENTORY',
  'CONFIRM',
  'PAUSE',
];
