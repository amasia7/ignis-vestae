import { describe, expect, it } from 'vitest';
import { RunState } from '../src/core/RunState';
import { WEAPONS, CLASS_WEAPONS } from '../src/data/weapons';
import { ITEMS } from '../src/data/items';
import { ENEMIES } from '../src/data/enemies';
import { LEVELS_PER_WORLD, WORLD_COUNT, levelSpec } from '../src/data/worlds';
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
  it('gli oggetti uguali si impilano in un solo slot con la quantità', () => {
    const run = new RunState();
    run.startRun(0);
    run.addItem('balsamo');
    run.addItem('balsamo');
    run.addItem('incenso');
    run.addItem('balsamo');
    expect(run.itemCounts()).toEqual([
      { id: 'balsamo', count: 3 },
      { id: 'incenso', count: 1 },
    ]);
    expect(run.countOf('balsamo')).toBe(3);
    expect(run.consumeItem('balsamo')).toBe(true);
    expect(run.countOf('balsamo')).toBe(2);
    expect(run.consumeItem('incenso')).toBe(true);
    expect(run.consumeItem('incenso')).toBe(false); // finiti
  });

  it("l'oggetto rapido parte dalla cura e cicla tra i tipi presenti", () => {
    const run = new RunState();
    run.startRun(0);
    expect(run.quickItem).toBe('balsamo');
    run.cycleQuickItem(); // borsa vuota: resta dov'è
    expect(run.quickItem).toBe('balsamo');
    run.addItem('balsamo');
    run.addItem('incenso');
    run.cycleQuickItem();
    expect(run.quickItem).toBe('incenso');
    run.cycleQuickItem();
    expect(run.quickItem).toBe('balsamo');
  });
});

describe('mondi e cammini', () => {
  it('3 mondi × 5 cammini, durata (larghezza) e nemici crescenti', () => {
    expect(WORLD_COUNT).toBe(3);
    expect(LEVELS_PER_WORLD).toBe(5);
    for (let w = 0; w < WORLD_COUNT; w++) {
      let prevWidth = 0;
      let prevEnemies = 0;
      for (let l = 0; l < LEVELS_PER_WORLD; l++) {
        const spec = levelSpec(w, l);
        expect(spec.width).toBeGreaterThan(prevWidth); // durata incrementale
        expect(spec.enemies.length).toBeGreaterThan(prevEnemies); // più nemici
        prevWidth = spec.width;
        prevEnemies = spec.enemies.length;
        expect(spec.arenaIdx).toBe(w); // stesso sfondo per tutto il mondo
        for (const e of spec.enemies) {
          expect(Object.keys(ENEMIES)).toContain(e.type);
          expect(e.x).toBeGreaterThan(200);
          expect(e.x).toBeLessThan(spec.width - 200);
        }
      }
    }
  });

  it('è deterministico: stesso seme, stesso layout', () => {
    expect(levelSpec(1, 2)).toEqual(levelSpec(1, 2));
  });

  it("2 segreti per mondo: un'arma (cammino II) e una benedizione (cammino IV)", () => {
    for (let w = 0; w < WORLD_COUNT; w++) {
      const urns = Array.from({ length: LEVELS_PER_WORLD }, (_, l) => levelSpec(w, l).urns).flat();
      expect(urns).toHaveLength(2);
      expect(urns.map((u) => u.content.kind).sort()).toEqual(['buff', 'weapon']);
      for (const u of urns) expect(u.uid).toContain(`w${w}`);
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
