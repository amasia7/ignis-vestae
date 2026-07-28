import { PLAYER } from '../config/balance';

/**
 * Resistenza del player: consumo a soglia e rigenerazione a 55/s.
 * Il legacy rigenera solo nello stato `free` (r. 371): decide il chiamante
 * quando invocare regen().
 */
export class Stamina {
  value: number;

  constructor(readonly max: number) {
    this.value = max;
  }

  /** Il legacy usa `st >= costo` (r. 335/340/341). */
  canAfford(cost: number): boolean {
    return this.value >= cost;
  }

  /** Consuma se possibile; false = azione bloccata per stamina insufficiente. */
  trySpend(cost: number): boolean {
    if (!this.canAfford(cost)) return false;
    this.value -= cost;
    return true;
  }

  regen(dtMs: number): void {
    this.value = Math.min(this.max, this.value + (PLAYER.staminaRegenPerSec * dtMs) / 1000);
  }
}
