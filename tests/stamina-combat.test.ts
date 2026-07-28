import { describe, expect, it } from 'vitest';
import { Stamina } from '../src/core/stamina';
import { attackDamage, effectiveMult, maxFlasks } from '../src/core/combat';
import { PLAYER, ABILITIES } from '../src/config/balance';
import { CLASSES } from '../src/data/classes';

describe('stamina', () => {
  it('consuma i costi legacy 25/14/28', () => {
    const st = new Stamina(100);
    expect(st.trySpend(PLAYER.roll.staminaCost)).toBe(true);
    expect(st.value).toBe(75);
    expect(st.trySpend(PLAYER.lightAttack.staminaCost)).toBe(true);
    expect(st.value).toBe(61);
    expect(st.trySpend(PLAYER.heavyAttack.staminaCost)).toBe(true);
    expect(st.value).toBe(33);
  });

  it('blocca le azioni quando insufficiente (soglia >= come il legacy)', () => {
    const st = new Stamina(100);
    st.value = 24.9;
    expect(st.trySpend(25)).toBe(false);
    expect(st.value).toBe(24.9); // nessun consumo parziale
    st.value = 25;
    expect(st.trySpend(25)).toBe(true);
  });

  it('rigenera a 55/s indipendentemente dal frame rate', () => {
    const at = (fps: number): number => {
      const st = new Stamina(100);
      st.value = 0;
      const dt = 1000 / fps;
      for (let frame = 0; frame < fps; frame++) st.regen(dt); // esattamente 1s
      return st.value;
    };
    // un secondo di rigenerazione ≈ 55 a ogni frame rate
    expect(at(30)).toBeCloseTo(55, 0);
    expect(at(60)).toBeCloseTo(55, 0);
    expect(at(144)).toBeCloseTo(55, 0);
  });

  it('non supera il massimo', () => {
    const st = new Stamina(100);
    st.value = 99;
    st.regen(1000);
    expect(st.value).toBe(100);
  });
});

describe('calcolo del danno', () => {
  it('mult per classe: 1 / 1.25 / 0.85', () => {
    expect(CLASSES.slice(0, 3).map((c) => effectiveMult(c.damageMult, false))).toEqual([
      1, 1.25, 0.85,
    ]);
  });

  it('MOLA SALSA moltiplica per 1.4', () => {
    expect(effectiveMult(1, true)).toBeCloseTo(1.4);
    expect(effectiveMult(1.25, true)).toBeCloseTo(1.75);
    expect(effectiveMult(0.85, true)).toBeCloseTo(1.19);
  });

  it('danni 9 e 20 scalati dal mult (come 9*mult / 20*mult legacy)', () => {
    expect(attackDamage(PLAYER.lightAttack.damage, 1.25)).toBeCloseTo(11.25);
    expect(attackDamage(PLAYER.heavyAttack.damage, 1.75)).toBeCloseTo(35);
  });

  it('anche dardo (26) e smite (40) passano dal mult, come nel legacy', () => {
    expect(attackDamage(ABILITIES.cast.boltDamage, 1.4)).toBeCloseTo(36.4);
    expect(attackDamage(ABILITIES.smite.damage, 1.25)).toBeCloseTo(50);
  });

  it('SUFFIMEN aggiunge un’ampolla', () => {
    expect(maxFlasks(4, false)).toBe(4);
    expect(maxFlasks(4, true)).toBe(5);
    expect(maxFlasks(3, true)).toBe(4);
  });
});
