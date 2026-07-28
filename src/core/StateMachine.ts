/**
 * Macchina a stati riusabile con tempo in millisecondi. Estrae la forma che
 * nel legacy è scritta tre volte (Player, boss): `stato` + `tempo nello
 * stato` + eventi one-shot a soglia (`if(!done && sT>=t)`) + finestre.
 *
 * Gli eventi `at(t, fn)` scattano UNA volta quando il tempo nello stato
 * raggiunge t, anche se un frame lungo salta oltre la soglia: nessun
 * telegrafo perso a frame rate basso (stessa semantica del legacy).
 */
export interface StateHandlers<TCtx> {
  onEnter?: (ctx: TCtx) => void;
  onUpdate?: (ctx: TCtx, dtMs: number) => void;
  onExit?: (ctx: TCtx) => void;
}

interface OneShot<TCtx> {
  t: number;
  fn: (ctx: TCtx) => void;
  fired: boolean;
}

export class StateMachine<TId extends string, TCtx = undefined> {
  private handlers: Partial<Record<TId, StateHandlers<TCtx>>>;
  private ctx: TCtx;
  private id: TId;
  private oneShots: OneShot<TCtx>[] = [];
  /** Cambia a ogni transizione: interrompe gli one-shot dello stato uscente. */
  private generation = 0;
  /** Tempo trascorso nello stato corrente, in ms (il `sT`/`aT` del legacy). */
  time = 0;

  constructor(initial: TId, handlers: Partial<Record<TId, StateHandlers<TCtx>>>, ctx: TCtx) {
    this.id = initial;
    this.handlers = handlers;
    this.ctx = ctx;
    this.handlers[initial]?.onEnter?.(ctx);
  }

  get state(): TId {
    return this.id;
  }

  is(...ids: TId[]): boolean {
    return ids.includes(this.id);
  }

  /** Transizione immediata: onExit → cambio → azzera tempo/eventi → onEnter. */
  set(id: TId): void {
    this.handlers[this.id]?.onExit?.(this.ctx);
    this.id = id;
    this.time = 0;
    this.oneShots = [];
    this.generation++;
    this.handlers[id]?.onEnter?.(this.ctx);
  }

  /**
   * Programma un evento one-shot a t ms dall'ingresso nello stato corrente.
   * Da chiamare tipicamente in onEnter; sopravvive solo fino alla prossima
   * transizione.
   */
  at(t: number, fn: (ctx: TCtx) => void): void {
    this.oneShots.push({ t, fn, fired: false });
  }

  /** Finestra inclusiva [t0, t1] come i confronti `>= <=` del legacy. */
  window(t0: number, t1: number): boolean {
    return this.time >= t0 && this.time <= t1;
  }

  update(dtMs: number): void {
    this.time += dtMs;
    const gen = this.generation;
    for (const shot of this.oneShots) {
      if (!shot.fired && this.time >= shot.t) {
        shot.fired = true;
        shot.fn(this.ctx);
        // se l'evento ha causato una transizione, gli eventi restanti
        // appartenevano allo stato vecchio: stop.
        if (this.generation !== gen) return;
      }
    }
    this.handlers[this.id]?.onUpdate?.(this.ctx, dtMs);
  }
}
