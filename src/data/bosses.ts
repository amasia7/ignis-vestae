/**
 * Parametri e pattern dei tre boss, data-driven. Tempi in ms, velocità in
 * px/s, offset relativi a GROUND o alla x del boss. Fonte: legacy r. 399-644;
 * ogni blocco cita le righe. Le finestre indicate come «windup» sono già i
 * valori di fase 1: in fase 2 vengono moltiplicate per `speedMult` ESATTAMENTE
 * dove il legacy moltiplica per `sp` (i campi non scalati sono annotati).
 *
 * L'interprete di questi dati arriva in Fase 6 (entities/bosses/); qui solo
 * dati e tipi.
 */

export type BossId = 'equus' | 'cornelia' | 'palladio'; // @scaffold:boss-id

export interface CircleHit {
  readonly radius: number;
  readonly damage: number;
  readonly knockback: number; // segno applicato a runtime verso il player
  readonly offsetX?: number; // relativo a x·face
  readonly offsetY?: number; // relativo a GROUND
}

export interface RectHit {
  readonly w: number;
  readonly h: number;
  readonly damage: number;
  readonly knockback: number;
}

export interface BossCommonData {
  readonly id: BossId;
  readonly hp: number;
  readonly spawnX: number;
  readonly textureKey: string;
  readonly textureH: number;
  readonly glowTint: number;
  readonly hurtbox: { readonly w: number; readonly h: number }; // ancorata a terra, centrata in x
  readonly phase2: {
    /** Soglia di attivazione sugli hp (0 = fase 2 disattivata: primi boss). */
    readonly hpThreshold: number;
    /** `lt` = si attiva con hp < soglia; `lte` = con hp <= soglia (Palladio). */
    readonly comparison: 'lt' | 'lte';
    /** Moltiplicatore applicato a windup e cooldown (valori < 1 = più veloce). */
    readonly speedMult: number;
    /** Moltiplicatore del danno in fase 2 (1 = invariato). */
    readonly damageMult: number;
  };
  readonly idle: {
    readonly moveSpeed: number;
    /** Il Palladio si ferma a questa distanza dal player (r. 578). */
    readonly stopDistance?: number;
  };
}

/* ---- EQUUS OCTOBER (legacy r. 425-477) ---- */
export interface EquusData extends BossCommonData {
  readonly selector: {
    /** r. 441: d>300 oppure rand<0.3 → carica; poi rand<0.5 → impennata, altrimenti soffio. */
    readonly chargeDistance: number;
    readonly chargeChance: number;
    readonly rearChance: number;
  };
  readonly charge: {
    readonly windupMs: number;
    readonly speed: number;
    readonly hit: RectHit; // hitbox = corpo intero, ogni frame di corsa
    readonly wallStopMargin: number; // r. 453: si ferma a x<72 o x>W-72
    readonly cooldownMs: number;
    readonly tiltRotation: number; // r. 449
  };
  readonly rear: {
    readonly windupMs: number;
    readonly hit: CircleHit;
    readonly recoverMs: number;
    readonly cooldownMs: number;
    readonly windupRotation: number; // r. 457: -face·0.35
  };
  readonly fire: {
    readonly windupMs: number;
    readonly flameCount: number;
    readonly flameFirstOffset: number; // r. 469: x + face·(50 + i·66)
    readonly flameSpacing: number;
    readonly recoverMs: number;
    readonly cooldownMs: number;
  };
  /** Novità del rework: onda bassa che corre a terra — si scavalca SOLO col salto. */
  readonly wave: {
    /** Estratta al posto del soffio con questa probabilità. */
    readonly chance: number;
    readonly windupMs: number;
    readonly speed: number;
    readonly recoverMs: number;
    readonly cooldownMs: number;
  };
}

export const EQUUS: EquusData = {
  id: 'equus',
  hp: 300, // r. 429
  spawnX: 720, // r. 427
  textureKey: 'equus',
  textureH: 120,
  glowTint: 0xff5a1e, // r. 407/411 (default del glow)
  hurtbox: { w: 120, h: 84 }, // r. 430
  // primo boss del gioco: NIENTE fase 2 (rework voluto dal committente)
  phase2: { hpThreshold: 0, comparison: 'lt', speedMult: 1, damageMult: 1 },
  idle: { moveSpeed: 80 }, // r. 438
  selector: { chargeDistance: 300, chargeChance: 0.3, rearChance: 0.5 }, // r. 441-443
  charge: {
    windupMs: 760, // r. 446
    speed: 900, // r. 450
    hit: { w: 120, h: 84, damage: 22, knockback: 260 }, // r. 451
    wallStopMargin: 72, // r. 453
    cooldownMs: 1250, // r. 453
    tiltRotation: 0.1, // r. 449
  },
  rear: {
    windupMs: 560, // r. 456
    hit: { radius: 115, damage: 18, knockback: 220, offsetX: 30, offsetY: -10 }, // r. 459
    recoverMs: 240, // r. 463
    cooldownMs: 1170, // r. 463
    windupRotation: -0.35, // r. 457
  },
  fire: {
    windupMs: 630, // r. 466
    flameCount: 4, // r. 469
    flameFirstOffset: 50, // r. 469
    flameSpacing: 66, // r. 469
    recoverMs: 380, // r. 471
    cooldownMs: 1400, // r. 471
  },
  wave: {
    chance: 0.5,
    windupMs: 560,
    speed: 430,
    recoverMs: 320,
    cooldownMs: 1300,
  },
};

/* ---- CORNELIA, LA SEPOLTA VIVA (legacy r. 479-556) ---- */
export interface CorneliaData extends BossCommonData {
  readonly float: { readonly amplitude: number; readonly periodMs: number }; // r. 493
  readonly selector: {
    /** r. 500-501: d<160 → rand<0.6 urlo / grab; altrimenti r<0.5 mani, r<0.8 tele, altrimenti grab. */
    readonly closeDistance: number;
    readonly screamChance: number;
    readonly handsChance: number;
    readonly teleChance: number;
  };
  readonly hands: {
    readonly windupMs: number;
    /** r. 507-508: bersagli a px e px ± spacing·i, i=1..pairs (fase 1: 1, fase 2: 2). */
    readonly spacing: number;
    readonly pairsPhase1: number;
    readonly pairsPhase2: number;
    readonly clampMargin: number; // r. 509: clamp 50..W-50
    readonly hit: CircleHit; // r. 519: per bersaglio, a GROUND-20
    readonly handRiseMs: number; // r. 517
    readonly recoverMs: number;
    readonly cooldownMs: number;
  };
  readonly grab: {
    readonly windupMs: number;
    readonly dashSpeed: number; // r. 530
    readonly dashDurationMs: number; // r. 529: finestra windup..windup+220
    readonly hit: RectHit; // r. 531
    readonly endAfterWindupMs: number; // r. 532: stato finisce a windup+520
    readonly cooldownMs: number;
  };
  readonly scream: {
    readonly windupMs: number;
    readonly hit: CircleHit; // r. 538: r150 a (x, GROUND-50)
    readonly recoverMs: number;
    readonly cooldownMs: number;
  };
  readonly tele: {
    readonly fadeOutMs: number; // r. 546
    readonly reappearMs: number; // r. 549-550: alpha 330→560, poi concatena grab
    readonly offsetFromPlayer: number; // r. 548: px ± 110 verso il centro
    readonly clampMargin: number; // r. 548: clamp 80..W-80
  };
}

export const CORNELIA: CorneliaData = {
  id: 'cornelia',
  hp: 340, // r. 483
  spawnX: 700, // r. 481
  textureKey: 'ghost',
  textureH: 112,
  glowTint: 0xa8c8ff, // r. 494
  hurtbox: { w: 52, h: 96 }, // r. 486
  // rework: fase 2 sensibilmente più dura (era speedMult 0.72, danno pieno)
  phase2: { hpThreshold: 170, comparison: 'lt', speedMult: 0.66, damageMult: 1.25 },
  idle: { moveSpeed: 55 }, // r. 497
  float: { amplitude: 6, periodMs: 260 }, // r. 493
  selector: { closeDistance: 160, screamChance: 0.6, handsChance: 0.5, teleChance: 0.8 }, // r. 500-501
  hands: {
    windupMs: 800, // r. 504
    spacing: 80, // r. 508
    pairsPhase1: 1, // r. 507: n=1 → 3 bersagli
    pairsPhase2: 2, // r. 507: n=2 → 5 bersagli
    clampMargin: 50, // r. 509
    hit: { radius: 40, damage: 15, knockback: 0, offsetY: -20 }, // r. 519
    handRiseMs: 90, // r. 517
    recoverMs: 430, // r. 523
    cooldownMs: 1000, // r. 523
  },
  grab: {
    windupMs: 500, // r. 526
    dashSpeed: 900, // r. 530
    dashDurationMs: 220, // r. 529
    hit: { w: 60, h: 96, damage: 19, knockback: 240 }, // r. 531
    endAfterWindupMs: 520, // r. 532
    cooldownMs: 1080, // r. 532
  },
  scream: {
    windupMs: 600, // r. 535
    hit: { radius: 150, damage: 22, knockback: 320, offsetY: -50 }, // r. 538
    recoverMs: 340, // r. 543
    cooldownMs: 1330, // r. 543
  },
  tele: {
    fadeOutMs: 330, // r. 546
    reappearMs: 560, // r. 549-550
    offsetFromPlayer: 110, // r. 548
    clampMargin: 80, // r. 548
  },
};

/* ---- IL PALLADIO (legacy r. 558-643) ---- */
export interface PalladioData extends BossCommonData {
  readonly phase2Tint: number; // r. 569
  readonly selector: {
    /** r. 581-583: d>260 → (fase2 e rand<0.45 → slam) altrimenti lancia;
     *  fase2 e rand<0.25 → slam; altrimenti combo. */
    readonly farDistance: number;
    readonly slamFarChancePhase2: number;
    readonly slamNearChancePhase2: number;
  };
  readonly combo: {
    readonly hitsPhase1: number; // r. 583: 2
    readonly hitsPhase2: number; // r. 583: 3
    readonly windupMs: number; // r. 586: 270·sp
    readonly activeMs: number; // r. 586: 110 (NON scalato)
    readonly gapMs: number; // r. 586: 170·sp
    readonly advanceSpeed: number; // r. 594
    readonly hit: RectHit; // r. 595: 110×72 davanti al boss
    readonly hitOffsetY: number; // r. 595: rettangolo a GROUND-88
    readonly cooldownMs: number; // r. 588
  };
  readonly throw: {
    readonly windupMs: number; // r. 601
    readonly spearSpeed: number; // r. 605: ±660
    readonly spawnOffsetX: number; // r. 605: x + face·32
    readonly spawnOffsetY: number; // r. 605: GROUND-36
    readonly recoverMs: number; // r. 607
    readonly cooldownMs: number; // r. 607
  };
  readonly slam: {
    /** r. 610: 330 FISSO, non scalato da speedMult (vedi docs/BALANCE-NOTES.md §1). */
    readonly windupMs: number;
    readonly flightMs: number; // r. 613-614: 570, non scalato
    readonly arcHeight: number; // r. 616: sin(p·π)·135
    readonly targetClampMargin: number; // r. 612: clamp px a 80..W-80
    readonly hit: CircleHit; // r. 621: r90 a GROUND-10
    readonly waveSpeed: number; // r. 622: onde a ±420
    readonly waveSpawnOffset: number; // r. 622: x∓20
    readonly endAfterWindupMs: number; // r. 626: stato finisce a windup+960
    readonly cooldownMs: number; // r. 626: 700, non scalato
    readonly shake: { readonly durationMs: number; readonly intensity: number }; // r. 620
  };
  readonly awaken: {
    readonly blastAtMs: number; // r. 631: 430
    readonly hit: CircleHit; // r. 632: r140 a GROUND-50
    readonly durationMs: number; // r. 637: 1000
    readonly cooldownMs: number; // r. 637: 500
  };
}

export const PALLADIO: PalladioData = {
  id: 'palladio',
  hp: 460, // r. 563
  spawnX: 720, // r. 560
  textureKey: 'statue',
  textureH: 120,
  glowTint: 0xffd76b, // r. 573
  hurtbox: { w: 48, h: 104 }, // r. 566
  // rework: fase 2 sensibilmente più dura (era solo speedMult 0.68)
  phase2: { hpThreshold: 230, comparison: 'lte', speedMult: 0.62, damageMult: 1.3 }, // r. 568/570
  phase2Tint: 0xd8b44f, // r. 569
  idle: { moveSpeed: 110, stopDistance: 95 }, // r. 578
  selector: { farDistance: 260, slamFarChancePhase2: 0.45, slamNearChancePhase2: 0.25 }, // r. 581-583
  combo: {
    hitsPhase1: 2, // r. 583
    hitsPhase2: 3, // r. 583
    windupMs: 270, // r. 586
    activeMs: 110, // r. 586
    gapMs: 170, // r. 586
    advanceSpeed: 330, // r. 594
    hit: { w: 110, h: 72, damage: 13, knockback: 220 }, // r. 595
    hitOffsetY: -88, // r. 595
    cooldownMs: 900, // r. 588
  },
  throw: {
    windupMs: 470, // r. 601
    spearSpeed: 660, // r. 605
    spawnOffsetX: 32, // r. 605
    spawnOffsetY: -36, // r. 605
    recoverMs: 320, // r. 607
    cooldownMs: 1000, // r. 607
  },
  slam: {
    windupMs: 330, // r. 610 — fisso anche in fase 2
    flightMs: 570, // r. 613
    arcHeight: 135, // r. 616
    targetClampMargin: 80, // r. 612
    hit: { radius: 90, damage: 16, knockback: 0, offsetY: -10 }, // r. 621
    waveSpeed: 420, // r. 622
    waveSpawnOffset: 20, // r. 622
    endAfterWindupMs: 960, // r. 626
    cooldownMs: 700, // r. 626
    shake: { durationMs: 200, intensity: 0.014 }, // r. 620
  },
  awaken: {
    blastAtMs: 430, // r. 631
    hit: { radius: 140, damage: 12, knockback: 300, offsetY: -50 }, // r. 632
    durationMs: 1000, // r. 637
    cooldownMs: 500, // r. 637
  },
};

// @scaffold:boss-data — new:boss inserisce qui i dati del nuovo boss

/** Ordine di incontro (legacy r. 644: BOSS_MAKERS). */
export const BOSSES: readonly BossCommonData[] = [
  EQUUS,
  CORNELIA,
  PALLADIO,
  // @scaffold:boss-list
];

/** Numero di boss della run: guida interludi, reliquie e salvataggio. */
export const BOSS_COUNT = BOSSES.length;
