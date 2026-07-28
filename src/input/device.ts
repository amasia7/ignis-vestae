/**
 * Rilevamento touch identico al legacy (r. 36): pointer:coarse.
 * Guardia per gli ambienti di test senza window.
 */
export const IS_TOUCH =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer:coarse)').matches;
