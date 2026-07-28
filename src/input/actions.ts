/** Le azioni astratte del gioco: le entità non leggono mai un tasto. */
export type Action =
  | 'MOVE_LEFT'
  | 'MOVE_RIGHT'
  | 'JUMP'
  | 'LIGHT'
  | 'HEAVY'
  | 'ROLL'
  | 'HEAL'
  | 'ABILITY'
  | 'CONFIRM'
  | 'PAUSE';

export const ACTIONS: readonly Action[] = [
  'MOVE_LEFT',
  'MOVE_RIGHT',
  'JUMP',
  'LIGHT',
  'HEAVY',
  'ROLL',
  'HEAL',
  'ABILITY',
  'CONFIRM',
  'PAUSE',
];
