/**
 * TUTTI i numeri di tuning del giocatore, dei pericoli e della scena di
 * combattimento, in un solo posto. Tempi in millisecondi, velocità in px/s.
 *
 * Fonte: legacy/ignis-vestae.html (riferimenti riga per riga nei commenti).
 * Regola della migrazione: questi valori NON si cambiano; i dubbi vanno in
 * docs/BALANCE-NOTES.md. I numeri dei boss vivono in data/bosses.ts.
 */

/** Player — fisica e azioni (legacy r. 255-397). */
export const PLAYER = {
  spawnX: 180, // r. 267
  body: { w: 30, h: 60, offsetX: 7, offsetY: 10 }, // r. 269
  dragX: 2400, // r. 271
  accelX: 2800, // r. 329
  maxVelY: 1000, // r. 272

  // NOTA: dal rework voluto dal committente questi valori DIVERGONO dal
  // legacy (salto più lungo per la verticalità, vedi BALANCE-NOTES §6)
  jumpVelocity: -680,
  jumpCutVelocity: -260,
  coyoteMs: 120,
  jumpBufferMs: 160,

  staminaRegenPerSec: 55, // r. 371: rigenera solo nello stato `free`

  roll: {
    // riscritto su richiesta: +30% di efficacia (distanza e finestra i-frame)
    staminaCost: 25,
    velocity: 754, // era 580
    maxVelocity: 806, // era 620
    durationMs: 460, // era 380
    iframeStartMs: 40, // era 50-300: finestra +30%
    iframeEndMs: 370,
    squashScaleY: 0.85, // l'animazione ora è una capriola (rotazione completa)
    groundedOnly: true,
  },

  lightAttack: {
    staminaCost: 14, // r. 340
    damage: 9, // r. 303 — moltiplicato per mult
    hitStartMs: 110, // r. 302: finestra attiva 110-220
    hitEndMs: 220,
    durationMs: 340, // r. 350
    box: { w: 78, h: 70 }, // r. 303
  },

  heavyAttack: {
    staminaCost: 28, // r. 341
    damage: 20, // r. 305
    hitStartMs: 300, // r. 304: finestra attiva 300-450
    hitEndMs: 450,
    durationMs: 620, // r. 353
    box: { w: 96, h: 82 }, // r. 305
  },

  /** Attacco a tasto unico: tap = leggero, oltre questa soglia = pesante. */
  attackChargeMs: 260,

  /** Scudo (classi pesanti): parata in mantenimento. */
  shield: {
    damageFactor: 0.3, // si subisce il 30% del danno
    staminaCostPerBlock: 8,
    blockInvulnMs: 300,
  },

  heal: {
    amount: 45, // r. 357
    applyAtMs: 550, // r. 355
    durationMs: 820, // r. 359
    groundedOnly: true, // r. 342
  },

  hurt: {
    invulnMs: 900, // r. 292
    stunMs: 350, // r. 368
    knockbackY: -140, // r. 293
    shake: { durationMs: 140, intensity: 0.008 }, // r. 294
  },
} as const;

/** Abilità di classe (legacy r. 281-288, 360-367, 824-830). */
export const ABILITIES = {
  /** FIAMMA VOTIVA (Vestale): dardo di fuoco. */
  cast: {
    applyAtMs: 240, // r. 361
    durationMs: 480, // r. 364
    boltSpeed: 560, // r. 362
    boltDamage: 26, // r. 894 — moltiplicato per mult
    spawnOffsetX: 26, // r. 362
    spawnOffsetY: -40,
  },
  /** IRA SACRILEGA (Sacerdote): devastazione d'area. */
  smite: {
    applyAtMs: 360, // r. 366
    durationMs: 700, // r. 367
    damage: 40, // r. 829 — moltiplicato per mult
    range: 135, // r. 829: |boss.x - player.x| < 135
    shake: { durationMs: 200, intensity: 0.014 }, // r. 825
  },
  /** PRESAGIO (Aruspice): etereo e veloce. */
  haste: {
    invulnMs: 2500, // r. 285
    durationMs: 2500, // r. 285
    speedMult: 1.45, // r. 323
  },
} as const;

/** Effetti meccanici delle reliquie (legacy r. 261-262). */
export const RELIC_EFFECTS = {
  suffimen: { flaskBonus: 1 }, // r. 261: un'ampolla in più
  molaSalsa: { damageMult: 1.4 }, // r. 262: mult × 1.4
} as const;

/** Pericoli condivisi della scena di combattimento (legacy r. 815-896). */
export const HAZARDS = {
  flame: {
    lifeMs: 4000, // r. 817
    damage: 7, // r. 875
    tickMs: 750, // r. 875: fireCd del player
    hitRangeX: 28, // r. 874
    hitRangeY: 30, // r. 874: colpisce se y > GROUND-30
    clampX: 40, // r. 816: clamp 40..W-40
  },
  spear: {
    damage: 15, // r. 880
    knockbackFactor: 0.45, // r. 880: kb = vx * 0.45
    box: { w: 56, h: 10 }, // r. 880
    despawnMargin: 10, // r. 881
  },
  wave: {
    damage: 14, // r. 886
    knockbackFactor: 0.5, // r. 886: kb = vx * 0.5
    box: { w: 24, h: 36 }, // r. 886
    despawnMargin: 20, // r. 887
  },
  bolt: {
    despawnMargin: 6, // r. 896
  },
} as const;

/** Tempistiche della scena di combattimento (legacy r. 856-868). */
export const FIGHT = {
  dtClampMs: 50, // r. 857: dt = min(dtRaw, 50)
  bossDeathFadeMs: 1500, // r. 866
  bossDeathToInterludeMs: 1800, // r. 868
  bossFlashMs: 110, // r. 413
  bossInitialCooldownMs: 1300, // r. 403
  bossClampMarginX: 60, // r. 415: x in [60, W-60]
} as const;
