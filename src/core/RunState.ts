import { BOSS_COUNT } from '../data/bosses';
import { CLASS_WEAPONS, WEAPONS, type WeaponId } from '../data/weapons';
import type { ItemId } from '../data/items';
import { BUFFS, type BuffEffect, type BuffId } from '../data/buffs';
import { LEVELS_PER_WORLD, WORLD_COUNT } from '../data/worlds';
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
  /** Oggetto rapido (rotella / tasto dedicato); default: la cura. */
  quickItem: ItemId = 'balsamo';
  /** Progressione nei mondi: cammino corrente (0..4; il boss viene dopo il 5°). */
  levelIdx = 0;
  /** Cammini completati, per la selezione dei livelli rigiocabili. */
  completedLevels: boolean[][] = emptyCompleted();
  /** Benedizioni permanenti della run. */
  buffs: BuffId[] = [];
  /** Segreti già raccolti (uid delle urne), per non farli ricomparire. */
  foundSecrets: string[] = [];
  /** Se impostato, si sta rigiocando un cammino completato. */
  replay: { world: number; level: number } | null = null;

  /** Selezione classe confermata (legacy Select.confirm, r. 759). */
  startRun(classIdx: number): void {
    this.classIdx = classIdx;
    this.bossIdx = 0;
    this.levelIdx = 0;
    this.relics = noRelics();
    this.completedLevels = emptyCompleted();
    this.buffs = [];
    this.foundSecrets = [];
    this.replay = null;
    this.resetInventory();
  }

  /**
   * Vittoria: torna al capo mantenendo classe, armi, benedizioni, segreti e
   * cammini completati (rigiocabili dal menu). Ricomincia solo la scalata.
   */
  endRun(): void {
    this.bossIdx = 0;
    this.levelIdx = 0;
    this.relics = noRelics();
    this.replay = null;
  }

  /* ---- mondi e cammini ---- */

  completeLevel(world: number, level: number): void {
    const row = this.completedLevels[world];
    if (row) row[level] = true;
  }

  isLevelCompleted(world: number, level: number): boolean {
    return this.completedLevels[world]?.[level] === true;
  }

  /* ---- benedizioni e segreti ---- */

  addBuff(id: BuffId): boolean {
    if (this.buffs.includes(id)) return false;
    this.buffs.push(id);
    return true;
  }

  buffTotal(effect: BuffEffect): number {
    return this.buffs.reduce((sum, id) => {
      const b = BUFFS[id];
      return b.effect === effect ? sum + b.amount : sum;
    }, 0);
  }

  markSecret(uid: string): void {
    if (!this.foundSecrets.includes(uid)) this.foundSecrets.push(uid);
  }

  hasSecret(uid: string): boolean {
    return this.foundSecrets.includes(uid);
  }

  /* ---- inventario ---- */

  resetInventory(): void {
    const base = CLASS_WEAPONS[this.classIdx] ?? 'secespita';
    this.weapons = [base];
    this.equippedWeapon = base;
    this.items = [];
    this.quickItem = 'balsamo';
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

  /**
   * Borsa raggruppata: un elenco per tipo con la quantità (×2, ×3…),
   * nell'ordine di prima raccolta. È la vista usata da HUD e inventario.
   */
  itemCounts(): { id: ItemId; count: number }[] {
    const order: ItemId[] = [];
    const counts = new Map<ItemId, number>();
    for (const id of this.items) {
      if (!counts.has(id)) order.push(id);
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return order.map((id) => ({ id, count: counts.get(id) ?? 0 }));
  }

  countOf(id: ItemId): number {
    return this.items.reduce((n, i) => (i === id ? n + 1 : n), 0);
  }

  /** Consuma UNA copia dell'oggetto. @returns false se non ce n'erano. */
  consumeItem(id: ItemId): boolean {
    const idx = this.items.indexOf(id);
    if (idx < 0) return false;
    this.items.splice(idx, 1);
    return true;
  }

  /** Cicla l'oggetto rapido tra i tipi presenti in borsa (tasto C). */
  cycleQuickItem(): void {
    const kinds = this.itemCounts().map((e) => e.id);
    if (kinds.length === 0) return;
    const next = kinds[(kinds.indexOf(this.quickItem) + 1) % kinds.length];
    if (next) this.quickItem = next;
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

  /** Passaggio al mondo successivo: si riparte dal primo cammino. */
  advance(): void {
    this.bossIdx++;
    this.levelIdx = 0;
  }

  get isComplete(): boolean {
    return this.bossIdx >= BOSS_COUNT;
  }

  /** mult effettivo: classe × MOLA SALSA (legacy) × benedizioni di danno. */
  effectiveMult(classMult: number): number {
    return effectiveMult(classMult, this.hasRelic(1)) * (1 + this.buffTotal('damagePct') / 100);
  }

  /** Ampolle massime: classe + SUFFIMEN (legacy) + LACRIME DI EGERIA. */
  maxFlasks(classFlasks: number): number {
    return maxFlasks(classFlasks, this.hasRelic(0)) + this.buffTotal('flask');
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

function emptyCompleted(): boolean[][] {
  return Array.from({ length: WORLD_COUNT }, () =>
    new Array<boolean>(LEVELS_PER_WORLD).fill(false),
  );
}

/** Istanza condivisa, come il RUN globale del legacy. */
export const RUN = new RunState();
