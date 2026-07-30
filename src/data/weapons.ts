/**
 * Armi staccate dal personaggio: ogni classe parte con la sua arma storica
 * (stessa resa visiva e stesso danno del legacy: damageMult 1), ma l'arma è
 * un oggetto equipaggiabile — altre armi si trovano nei livelli e si
 * selezionano dalla borsa (tasto I).
 */
export type WeaponId = 'secespita' | 'spatha' | 'lituus' | 'gladius'; // @scaffold:weapon-id

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
  // trovabile nei livelli: il ferro dei legionari, consacrato a dovere
  gladius: { id: 'gladius', textureKey: 'wp3', damageMult: 1.1 },
  // @scaffold:weapon-data
};

/** Arma di partenza per indice di classe (vestale/sacerdote/aruspice). */
export const CLASS_WEAPONS: readonly WeaponId[] = ['secespita', 'spatha', 'lituus'];
