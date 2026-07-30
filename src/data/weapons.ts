/**
 * Armi staccate dal personaggio: ogni classe parte con la sua arma storica
 * (stessa resa visiva e stesso danno del legacy: damageMult 1), ma l'arma è
 * un oggetto equipaggiabile — altre armi si trovano nei livelli e si
 * selezionano dalla borsa (tasto I).
 */
export type WeaponId =
  'secespita' | 'spatha' | 'lituus' | 'gladius' | 'falx' | 'dolabra' | 'hasta' | 'flammeus'; // @scaffold:weapon-id

export interface WeaponData {
  readonly id: WeaponId;
  /** Texture nel manifest (assets/<chiave>.png la sostituisce). */
  readonly textureKey: string;
  /** Moltiplicatore applicato al danno del player (1 = come il legacy). */
  readonly damageMult: number;
}

export const WEAPONS: Readonly<Record<WeaponId, WeaponData>> = {
  secespita: { id: 'secespita', textureKey: 'wp0', damageMult: 1 },
  spatha: { id: 'spatha', textureKey: 'wp1', damageMult: 1 },
  lituus: { id: 'lituus', textureKey: 'wp2', damageMult: 1 },
  // bottino di Equus October
  gladius: { id: 'gladius', textureKey: 'wp3', damageMult: 1.1 },
  // segreti dei tre mondi
  falx: { id: 'falx', textureKey: 'wp4', damageMult: 1.05 },
  dolabra: { id: 'dolabra', textureKey: 'wp5', damageMult: 1.15 },
  hasta: { id: 'hasta', textureKey: 'wp6', damageMult: 1.25 },
  // bottino del Palladio: la spada fiammeggiante dall'elsa d'oro
  flammeus: { id: 'flammeus', textureKey: 'wp7', damageMult: 1.3 },
  // @scaffold:weapon-data
};

/** Arma di partenza per indice di classe (vestale/sacerdote/aruspice). */
export const CLASS_WEAPONS: readonly WeaponId[] = ['secespita', 'spatha', 'lituus'];
