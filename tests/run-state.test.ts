import { describe, expect, it } from 'vitest';
import { RunState } from '../src/core/RunState';
import { CLASSES } from '../src/data/classes';

describe('RunState — progressione della run', () => {
  it('startRun azzera boss e reliquie e imposta la classe (legacy Select.confirm)', () => {
    const run = new RunState();
    run.grantRelic(0);
    run.advance();
    run.startRun(2);
    expect(run.classIdx).toBe(2);
    expect(run.bossIdx).toBe(0);
    expect(run.relics).toEqual([false, false, false]);
  });

  it('le reliquie si applicano al passaggio di boss', () => {
    const run = new RunState();
    run.startRun(1); // Sacerdote: mult 1.25, 3 ampolle
    const cls = CLASSES[1];

    // prima di Equus: nessun bonus
    expect(run.effectiveMult(cls.damageMult)).toBeCloseTo(1.25);
    expect(run.maxFlasks(cls.flasks)).toBe(3);

    // dopo Equus: SUFFIMEN → +1 ampolla, danno invariato
    run.grantRelic(0);
    run.advance();
    expect(run.maxFlasks(cls.flasks)).toBe(4);
    expect(run.effectiveMult(cls.damageMult)).toBeCloseTo(1.25);

    // dopo Cornelia: MOLA SALSA → mult ×1.4
    run.grantRelic(1);
    run.advance();
    expect(run.effectiveMult(cls.damageMult)).toBeCloseTo(1.75);
    expect(run.maxFlasks(cls.flasks)).toBe(4);

    // dopo il Palladio: run completa
    run.grantRelic(2);
    run.advance();
    expect(run.isComplete).toBe(true);
  });

  it('endRun mantiene la classe come il legacy (r. 980)', () => {
    const run = new RunState();
    run.startRun(2);
    run.grantRelic(0);
    run.advance();
    run.endRun();
    expect(run.classIdx).toBe(2); // la Select ripropone l'ultima classe
    expect(run.bossIdx).toBe(0);
    expect(run.relics).toEqual([false, false, false]);
  });

  it('best time per boss: registra solo i miglioramenti', () => {
    const run = new RunState();
    expect(run.recordTime(0, 60000)).toBe(true);
    expect(run.recordTime(0, 75000)).toBe(false);
    expect(run.bestTimesMs[0]).toBe(60000);
    expect(run.recordTime(0, 45000)).toBe(true);
    expect(run.bestTimesMs[0]).toBe(45000);
  });
});
