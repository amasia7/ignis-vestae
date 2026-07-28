import type { Action } from './actions';
import { ACTIONS } from './actions';
import { IS_TOUCH } from './device';

export interface InputSnapshot {
  held: ReadonlySet<Action>;
  just: ReadonlySet<Action>;
}

/** Una sorgente (tastiera, pad virtuale, gamepad) fotografa il suo stato. */
export interface InputSource {
  /** Chiamata una volta per frame; la sorgente consuma i propri just-pressed. */
  poll(): InputSnapshot;
}

/**
 * Aggregatore unico dell'input: OR di tutte le sorgenti, con distinzione
 * held / just-pressed. A differenza del legacy (r. 245: l'OR in corto
 * circuito poteva lasciare pressioni in coda nel VPad), qui ogni sorgente
 * viene sempre consultata e consumata — vedi docs/KNOWN-ISSUES.md §2.
 */
export class InputManager {
  private sources: InputSource[] = [];
  private held = new Set<Action>();
  private just = new Set<Action>();

  addSource(source: InputSource): void {
    this.sources.push(source);
  }

  /** Da chiamare all'inizio dell'update della scena, prima delle entità. */
  update(): void {
    this.held.clear();
    this.just.clear();
    for (const source of this.sources) {
      const snap = source.poll();
      for (const a of ACTIONS) {
        if (snap.held.has(a)) this.held.add(a);
        if (snap.just.has(a)) this.just.add(a);
      }
    }
  }

  isHeld(action: Action): boolean {
    return this.held.has(action);
  }

  justPressed(action: Action): boolean {
    return this.just.has(action);
  }

  /** Asse orizzontale -1/0/+1 (legacy r. 327-328). */
  moveAxis(): number {
    let ax = 0;
    if (this.isHeld('MOVE_LEFT')) ax--;
    if (this.isHeld('MOVE_RIGHT')) ax++;
    return ax;
  }

  /**
   * Il taglio del salto legge questo, non isHeld('JUMP'): su touch il legacy
   * considera il salto sempre tenuto (r. 246) — salto sempre pieno.
   */
  jumpHeldForCut(): boolean {
    return this.isHeld('JUMP') || IS_TOUCH;
  }
}
