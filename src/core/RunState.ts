import { BOSS_COUNT } from '../data/bosses';
import { CLASS_WEAPONS, WEAPONS, type WeaponId } from '../data/weapons';
import type { ItemId } from '../data/items';
import { effectiveMult, maxFlasks } from './combat';

export { BOSS_COUNT };

/**
 * Stato della run, sopravvive ai cambi di scena (il RUN globale del legacy,
 * r. 57). Semantica identica: la classe persiste anche dopo la vittoria
 * (r. 980 resetta solo bossIdx e reliquie).
 */
const noRelics = (): boolean[] => new Array<boolean>(BOSS_COUNT).fill(false);

export class RunState {
  classIdx = 0;
  bossIdx = 0;
  relics: boolean[] = noRelics();
  /** Best time per boss in ms (novità Fase 8; null = mai battuto). */
  bestTimesMs: (number | null)[] = new Array<number | null>(BOSS_COUNT).fill(null);
  /** Inventario della run: armi possedute, arma in pugno, borsa oggetti. */
  weapons: WeaponId[] = [CLASS_WEAPONS[0] ?? 'secespita'];
  equippedWeapon: WeaponId = CLASS_WEAPONS[0] ?? 'secespita';
  items: ItemId[] = [];

  /** Selezione classe confermata (legacy Select.confirm, r. 759). */
  startRun(classIdx: number): void {
    this.classIdx = classIdx;
    this.bossIdx = 0;
    this.relics = noRelics();
    this.resetInventory();
  }

  /** Vittoria: torna al titolo mantenendo la classe (legacy r. 980). */
  endRun(): void {
    this.bossIdx = 0;
    this.relics = noRelics();
    this.resetInventory();
  }

  /* ---- inventario ---- */

  resetInventory(): void {
    const base = CLASS_WEAPONS[this.classIdx] ?? 'secespita';
    this.weapons = [base];
    this.equippedWeapon = base;
    this.items = [];
  }

  addWeapon(id: WeaponId): boolean {
    if (this.weapons.includes(id)) return false;
    this.weapons.push(id);
    return true;
  }

  equipWeapon(id: WeaponId): void {
    if (this.weapons.includes(id)) this.equippedWeapon = id;
  }

  addItem(id: ItemId): void {
    this.items.push(id);
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  /** Moltiplicatore dell'arma in pugno (1 per le armi di classe legacy). */
  weaponMult(): number {
    return WEAPONS[this.equippedWeapon].damageMult;
  }

  grantRelic(bossIdx: number): void {
    this.relics[bossIdx] = true;
  }

  hasRelic(idx: number): boolean {
    return this.relics[idx] === true;
  }

  advance(): void {
    this.bossIdx++;
  }

  get isComplete(): boolean {
    return this.bossIdx >= BOSS_COUNT;
  }

  /** mult effettivo del player: classe × MOLA SALSA (legacy r. 262). */
  effectiveMult(classMult: number): number {
    return effectiveMult(classMult, this.hasRelic(1));
  }

  /** Ampolle massime: classe + SUFFIMEN (legacy r. 261). */
  maxFlasks(classFlasks: number): number {
    return maxFlasks(classFlasks, this.hasRelic(0));
  }

  /** Registra il tempo di uccisione; true se è un nuovo record. */
  recordTime(bossIdx: number, timeMs: number): boolean {
    const best = this.bestTimesMs[bossIdx];
    if (best == null || timeMs < best) {
      this.bestTimesMs[bossIdx] = timeMs;
      return true;
    }
    return false;
  }
}

/** Istanza condivisa, come il RUN globale del legacy. */
export const RUN = new RunState();
