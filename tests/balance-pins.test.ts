import { describe, expect, it } from 'vitest';
import { PLAYER, ABILITIES, RELIC_EFFECTS, HAZARDS, FIGHT } from '../src/config/balance';
import { GROUND, GRAVITY_Y, H, W } from '../src/config/game.config';
import { EQUUS, CORNELIA, PALLADIO } from '../src/data/bosses';

/**
 * Blinda i valori di tuning citati come non negoziabili nel brief di
 * migrazione: se qualcuno li tocca per sbaglio, questo test fallisce.
 * La fonte resta legacy/ignis-vestae.html.
 */
describe('valori non negoziabili del game feel', () => {
  it('mondo', () => {
    expect([W, H, GROUND, GRAVITY_Y]).toEqual([960, 540, 460, 1500]);
  });

  // NOTA: salto e roll DIVERGONO dal legacy per volontà del committente
  // (verticalità e roll +30% — vedi BALANCE-NOTES §6). Blindati sui nuovi.
  it('salto potenziato per la verticalità: forza, taglio, coyote, buffer', () => {
    expect(PLAYER.jumpVelocity).toBe(-680);
    expect(PLAYER.jumpCutVelocity).toBe(-260);
    expect(PLAYER.coyoteMs).toBe(120);
    expect(PLAYER.jumpBufferMs).toBe(160);
  });

  it('roll riscritto (+30%): i-frame 40-370 nella capriola da 460ms', () => {
    expect(PLAYER.roll.iframeStartMs).toBe(40);
    expect(PLAYER.roll.iframeEndMs).toBe(370);
    expect(PLAYER.roll.durationMs).toBe(460);
    expect(PLAYER.roll.velocity).toBe(754);
  });

  it('attacco a tasto unico: soglia di carica del colpo pesante', () => {
    expect(PLAYER.attackChargeMs).toBe(260);
  });

  it('stamina: costi 25/14/28 e rigenerazione 55/s', () => {
    expect(PLAYER.roll.staminaCost).toBe(25);
    expect(PLAYER.lightAttack.staminaCost).toBe(14);
    expect(PLAYER.heavyAttack.staminaCost).toBe(28);
    expect(PLAYER.staminaRegenPerSec).toBe(55);
  });

  it('danni base 9 e 20 (moltiplicati per mult)', () => {
    expect(PLAYER.lightAttack.damage).toBe(9);
    expect(PLAYER.heavyAttack.damage).toBe(20);
  });

  it('abilità: dardo 26, smite 40, presagio 2.5s ×1.45', () => {
    expect(ABILITIES.cast.boltDamage).toBe(26);
    expect(ABILITIES.smite.damage).toBe(40);
    expect(ABILITIES.haste.durationMs).toBe(2500);
    expect(ABILITIES.haste.speedMult).toBe(1.45);
  });

  it('reliquie: +1 ampolla e mult ×1.4', () => {
    expect(RELIC_EFFECTS.suffimen.flaskBonus).toBe(1);
    expect(RELIC_EFFECTS.molaSalsa.damageMult).toBe(1.4);
  });

  it('hp dei boss 300/340/460 e soglia fase 2 del Palladio a 230', () => {
    expect([EQUUS.hp, CORNELIA.hp, PALLADIO.hp]).toEqual([300, 340, 460]);
    expect(PALLADIO.phase2.hpThreshold).toBe(230);
    expect(PALLADIO.phase2.comparison).toBe('lte');
  });

  it('moltiplicatori di velocità di fase 2: 0.75 / 0.72 / 0.68', () => {
    expect([EQUUS.phase2.speedMult, CORNELIA.phase2.speedMult, PALLADIO.phase2.speedMult]).toEqual([
      0.75, 0.72, 0.68,
    ]);
  });

  it('pericoli: fiamma 7 ogni 750ms per 4s, lancia 15, onda 14', () => {
    expect(HAZARDS.flame).toMatchObject({ damage: 7, tickMs: 750, lifeMs: 4000 });
    expect(HAZARDS.spear.damage).toBe(15);
    expect(HAZARDS.wave.damage).toBe(14);
  });

  it('scena di combattimento: clamp dt 50ms, dissolvenza boss 1500ms', () => {
    expect(FIGHT.dtClampMs).toBe(50);
    expect(FIGHT.bossDeathFadeMs).toBe(1500);
    expect(FIGHT.bossDeathToInterludeMs).toBe(1800);
  });
});
