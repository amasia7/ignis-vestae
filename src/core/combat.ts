import { PLAYER, RELIC_EFFECTS } from '../config/balance';

/**
 * Calcoli di combattimento puri, testabili senza Phaser.
 * Semantica identica al legacy.
 */

/** mult effettivo: classe × MOLA SALSA (legacy r. 262: c.mult*(relics[1]?1.4:1)). */
export function effectiveMult(classMult: number, hasMolaSalsa: boolean): number {
  return classMult * (hasMolaSalsa ? RELIC_EFFECTS.molaSalsa.damageMult : 1);
}

/** Danno inflitto: base × mult (legacy r. 303/305: 9*mult, 20*mult). */
export function attackDamage(base: number, mult: number): number {
  return base * mult;
}

/** Ampolle massime: classe + SUFFIMEN (legacy r. 261: c.fl+(relics[0]?1:0)). */
export function maxFlasks(classFlasks: number, hasSuffimen: boolean): number {
  return classFlasks + (hasSuffimen ? RELIC_EFFECTS.suffimen.flaskBonus : 0);
}

/**
 * I-frame del roll: attivi nella finestra inclusiva 50-300ms
 * (legacy r. 280: sT>=50 && sT<=300).
 */
export function rollIFrameActive(timeInRollMs: number): boolean {
  return timeInRollMs >= PLAYER.roll.iframeStartMs && timeInRollMs <= PLAYER.roll.iframeEndMs;
}
