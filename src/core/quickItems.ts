import { ITEMS } from '../data/items';
import { RUN } from './RunState';

/** Il minimo che serve per applicare un oggetto (il Player lo soddisfa). */
interface ItemTarget {
  hp: number;
  mhp: number;
  stamina: { value: number; max: number };
}

/**
 * Usa l'oggetto rapido corrente sul bersaglio.
 * @returns true se l'oggetto è stato consumato (falso: borsa vuota o
 * effetto inutile, es. cura a vita piena).
 */
export function useQuickItem(target: ItemTarget): boolean {
  const item = ITEMS[RUN.quickItem];
  if (RUN.countOf(item.id) === 0) return false;
  if (item.effect === 'heal') {
    if (target.hp >= target.mhp) return false;
    target.hp = Math.min(target.mhp, target.hp + item.amount);
  } else {
    if (target.stamina.value >= target.stamina.max) return false;
    target.stamina.value = Math.min(target.stamina.max, target.stamina.value + item.amount);
  }
  return RUN.consumeItem(item.id);
}
