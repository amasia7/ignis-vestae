import { describe, expect, it } from 'vitest';
import { RunState } from '../src/core/RunState';
import { WEAPONS, CLASS_WEAPONS } from '../src/data/weapons';
import { ITEMS } from '../src/data/items';
import { ENEMIES } from '../src/data/enemies';
import { LEVELS } from '../src/data/levels';
import { TEXTURES } from '../src/art/registry';
import { STRINGS_IT } from '../src/data/strings.it';

describe('armi staccate dal personaggio', () => {
  it('ogni classe parte con la sua arma storica (danno invariato: mult 1)', () => {
    for (let cls = 0; cls < CLASS_WEAPONS.length; cls++) {
      const run = new RunState();
      run.startRun(cls);
      expect(run.weapons).toEqual([CLASS_WEAPONS[cls]]);
      expect(run.equippedWeapon).toBe(CLASS_WEAPONS[cls]);
      expect(run.weaponMult()).toBe(1);
    }
  });

  it('un’arma trovata si aggiunge, si equipaggia e applica il suo mult', () => {
    const run = new RunState();
    run.startRun(0);
    expect(run.addWeapon('gladius')).toBe(true);
    expect(run.addWeapon('gladius')).toBe(false); // niente doppioni
    run.equipWeapon('gladius');
    expect(run.equippedWeapon).toBe('gladius');
    expect(run.weaponMult()).toBeCloseTo(1.1);
    // equipaggiare un'arma non posseduta non fa nulla
    run.equipWeapon('spatha');
    expect(run.equippedWeapon).toBe('gladius');
  });

  it('la nuova run azzera la borsa', () => {
    const run = new RunState();
    run.startRun(1);
    run.addWeapon('gladius');
    run.addItem('balsamo');
    run.startRun(1);
    expect(run.weapons).toEqual(['spatha']);
    expect(run.items).toEqual([]);
  });

  it('ogni arma e oggetto ha texture nel manifest e testi nel bundle', () => {
    for (const w of Object.values(WEAPONS)) {
      expect(Object.keys(TEXTURES)).toContain(w.textureKey);
      expect(STRINGS_IT.weapons[w.id].name.length).toBeGreaterThan(0);
    }
    for (const i of Object.values(ITEMS)) {
      expect(Object.keys(TEXTURES)).toContain(i.textureKey);
      expect(STRINGS_IT.items[i.id].name.length).toBeGreaterThan(0);
    }
  });
});

describe('oggetti nella borsa', () => {
  it('si accumulano e si consumano per indice', () => {
    const run = new RunState();
    run.startRun(0);
    run.addItem('balsamo');
    run.addItem('balsamo');
    expect(run.items).toHaveLength(2);
    run.removeItem(0);
    expect(run.items).toHaveLength(1);
  });
});

describe('livelli intermedi', () => {
  it('un livello per boss, con progressione da sinistra a destra', () => {
    expect(LEVELS.length).toBe(3);
    for (const level of LEVELS) {
      expect(level.width).toBeGreaterThan(960);
      for (const e of level.enemies) {
        expect(Object.keys(ENEMIES)).toContain(e.type);
        expect(e.x).toBeGreaterThan(200); // non addosso allo spawn del player
        expect(e.x).toBeLessThan(level.width - 200); // non dentro il braciere
      }
      for (const p of level.pickups) {
        expect(p.x).toBeGreaterThan(0);
        expect(p.x).toBeLessThan(level.width);
      }
    }
  });

  it('i nemici hanno dati sani e texture nel manifest', () => {
    for (const e of Object.values(ENEMIES)) {
      expect(e.hp).toBeGreaterThan(0);
      expect(e.windupMs).toBeGreaterThan(0); // sempre telegrafato
      expect(e.dropChance).toBeGreaterThanOrEqual(0);
      expect(e.dropChance).toBeLessThanOrEqual(1);
      expect(Object.keys(TEXTURES)).toContain(e.textureKey);
    }
  });
});
