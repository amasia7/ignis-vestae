import { describe, expect, it } from 'vitest';
import { JumpTimers } from '../src/input/JumpTimers';

/**
 * Coyote time (90ms) e jump buffer (130ms) devono comportarsi allo stesso
 * modo a 30, 60 e 144 fps. I tempi di prova sono scelti lontani dai bordi
 * delle finestre, dove la quantizzazione del frame è inevitabile.
 */
const FPS = [30, 60, 144] as const;

/** Esegue una sequenza (grounded, pressed) campionata a dt fisso. */
function simulate(
  fps: number,
  durationMs: number,
  grounded: (t: number) => boolean,
  pressAt: number,
): { jumped: boolean; jumpTime: number } {
  const jt = new JumpTimers();
  const dt = 1000 / fps;
  let pressed = false;
  for (let t = 0; t <= durationMs; t += dt) {
    const justPressed = !pressed && t >= pressAt;
    if (justPressed) pressed = true;
    jt.update(dt, grounded(t), justPressed);
    if (jt.shouldJump) {
      jt.consume();
      return { jumped: true, jumpTime: t };
    }
  }
  return { jumped: false, jumpTime: -1 };
}

describe.each(FPS)('a %i fps', (fps) => {
  it('salto normale da terra', () => {
    const r = simulate(fps, 500, () => true, 100);
    expect(r.jumped).toBe(true);
  });

  it('coyote: il salto premuto 40ms dopo aver lasciato il bordo funziona', () => {
    // a terra fino a t=150, poi in aria; pressione a t=190. Il margine tiene
    // conto della quantizzazione del frame a 30fps (~33ms per frame).
    const r = simulate(fps, 800, (t) => t < 150, 190);
    expect(r.jumped).toBe(true);
  });

  it('coyote scaduto: premuto 150ms dopo il bordo NON salta', () => {
    const r = simulate(fps, 800, (t) => t < 200, 350);
    expect(r.jumped).toBe(false);
  });

  it('buffer: premuto 100ms prima di atterrare, salta all’atterraggio', () => {
    // in aria (dopo lungo volo) fino a t=600, pressione a t=500
    const r = simulate(fps, 1000, (t) => t < 100 || t >= 600, 500);
    expect(r.jumped).toBe(true);
    expect(r.jumpTime).toBeGreaterThanOrEqual(600 - 1000 / fps);
  });

  it('buffer scaduto: premuto 200ms prima di atterrare NON salta', () => {
    const r = simulate(fps, 1000, (t) => t < 100 || t >= 700, 500);
    expect(r.jumped).toBe(false);
  });

  it('consume() impedisce il doppio salto dallo stesso input', () => {
    const jt = new JumpTimers();
    jt.update(1000 / fps, true, true);
    expect(jt.shouldJump).toBe(true);
    jt.consume();
    expect(jt.shouldJump).toBe(false);
    jt.update(1000 / fps, false, false);
    expect(jt.shouldJump).toBe(false);
  });
});
