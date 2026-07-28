import { describe, expect, it, vi } from 'vitest';
import { StateMachine } from '../src/core/StateMachine';
import { rollIFrameActive } from '../src/core/combat';

type Id = 'free' | 'roll' | 'attL';

function machine(handlers: ConstructorParameters<typeof StateMachine<Id, undefined>>[1] = {}) {
  return new StateMachine<Id, undefined>('free', handlers, undefined);
}

describe('StateMachine', () => {
  it('chiama onEnter/onExit nelle transizioni', () => {
    const enter = vi.fn();
    const exit = vi.fn();
    const sm = machine({ free: { onExit: exit }, roll: { onEnter: enter } });
    sm.set('roll');
    expect(exit).toHaveBeenCalledTimes(1);
    expect(enter).toHaveBeenCalledTimes(1);
  });

  it('azzera il tempo a ogni transizione', () => {
    const sm = machine();
    sm.update(200);
    expect(sm.time).toBe(200);
    sm.set('roll');
    expect(sm.time).toBe(0);
  });

  it('gli eventi at() scattano una sola volta, anche con dt che salta la soglia', () => {
    const sm = machine();
    const fn = vi.fn();
    sm.set('attL');
    sm.at(110, fn);
    sm.update(50); // 50ms: non ancora
    expect(fn).not.toHaveBeenCalled();
    sm.update(500); // 550ms: soglia superata di colpo (frame lungo)
    expect(fn).toHaveBeenCalledTimes(1);
    sm.update(100);
    expect(fn).toHaveBeenCalledTimes(1); // mai due volte
  });

  it('gli eventi si perdono alla transizione (appartengono allo stato vecchio)', () => {
    const sm = machine();
    const fn = vi.fn();
    sm.set('attL');
    sm.at(110, fn);
    sm.set('free');
    sm.update(500);
    expect(fn).not.toHaveBeenCalled();
  });

  it('una transizione dentro un evento interrompe gli eventi successivi', () => {
    const sm = machine();
    const second = vi.fn();
    sm.set('attL');
    sm.at(100, () => sm.set('free'));
    sm.at(150, second);
    sm.update(300); // supererebbe entrambe le soglie
    expect(sm.state).toBe('free');
    expect(second).not.toHaveBeenCalled();
  });

  it('window() è inclusiva come i confronti del legacy', () => {
    const sm = machine();
    sm.set('roll');
    sm.update(50);
    expect(sm.window(50, 300)).toBe(true);
    sm.update(250); // t=300
    expect(sm.window(50, 300)).toBe(true);
    sm.update(1); // t=301
    expect(sm.window(50, 300)).toBe(false);
  });
});

describe('i-frame del roll (50-300ms)', () => {
  it('inattivi prima di 50ms, attivi nella finestra, spenti dopo 300ms', () => {
    expect(rollIFrameActive(0)).toBe(false);
    expect(rollIFrameActive(49)).toBe(false);
    expect(rollIFrameActive(50)).toBe(true);
    expect(rollIFrameActive(175)).toBe(true);
    expect(rollIFrameActive(300)).toBe(true);
    expect(rollIFrameActive(301)).toBe(false);
    expect(rollIFrameActive(380)).toBe(false);
  });
});
