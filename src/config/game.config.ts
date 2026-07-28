/**
 * Costanti di mondo e configurazione Phaser.
 * Fonte: legacy/ignis-vestae.html r. 35 (W/H/GROUND), r. 787 (bounds fisica),
 * r. 988-995 (config Phaser). Valori intoccabili: definiscono il game feel.
 */
export const W = 960;
export const H = 540;
export const GROUND = 460;

export const GRAVITY_Y = 1500;
export const BG_COLOR = '#0b0810';
export const PAGE_BG_COLOR = '#070509';
export const MENU_BG_COLOR = '#060409';
export const ACTIVE_POINTERS = 4;

/** Bounds del mondo fisico nella scena di combattimento (r. 787). */
export const PHYSICS_BOUNDS = {
  x: 30,
  y: -400,
  width: W - 60,
  height: GROUND + 400,
} as const;
