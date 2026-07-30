import { BOSS_COUNT, RUN } from './RunState';
import type { WeaponId } from '../data/weapons';
import type { ItemId } from '../data/items';
import type { BuffId } from '../data/buffs';
import { DEFAULT_SETTINGS, applySettings, settings, type SettingsData } from './settings';

/**
 * Persistenza su localStorage, versione 2: TRE slot di salvataggio separati
 * più le impostazioni globali (condivise tra gli slot). Ogni slot custodisce
 * l'intera run: classe, mondo/cammino, reliquie, inventario, benedizioni,
 * segreti, cammini completati e best time.
 */
export const SLOT_COUNT = 3;
const SLOT_KEY = (i: number): string => `ignis-vestae:v2:slot${i}`;
const SETTINGS_KEY = 'ignis-vestae:v2:settings';

interface SlotData {
  version: 2;
  classIdx: number;
  bossIdx: number;
  levelIdx: number;
  relics: boolean[];
  bestTimesMs: (number | null)[];
  weapons: WeaponId[];
  equippedWeapon: WeaponId;
  items: ItemId[];
  quickItem?: ItemId;
  buffs: BuffId[];
  foundSecrets: string[];
  completedLevels: boolean[][];
}

export interface SlotSummary {
  exists: boolean;
  classIdx: number;
  bossIdx: number;
  levelIdx: number;
  relics: number;
}

function storage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

function readSlot(i: number): Partial<SlotData> | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(SLOT_KEY(i));
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<SlotData>;
    return data.version === 2 ? data : null;
  } catch {
    return null;
  }
}

let activeSlot = 0;

export const SaveManager = {
  get activeSlot(): number {
    return activeSlot;
  },

  setActiveSlot(i: number): void {
    activeSlot = Math.max(0, Math.min(SLOT_COUNT - 1, i));
  },

  /** All'avvio: solo le impostazioni globali (la run si carica dallo slot). */
  loadSettings(): void {
    const s = storage();
    if (!s) return;
    try {
      const raw = s.getItem(SETTINGS_KEY);
      if (raw) applySettings(JSON.parse(raw) as Partial<SettingsData>);
    } catch {
      /* impostazioni corrotte: default */
    }
  },

  saveSettings(): void {
    try {
      storage()?.setItem(
        SETTINGS_KEY,
        JSON.stringify({ ...settings, bindings: { ...settings.bindings } }),
      );
    } catch {
      /* pazienza */
    }
  },

  /** Carica lo slot dentro RUN e lo rende attivo. @returns false se vuoto. */
  loadSlot(i: number): boolean {
    const data = readSlot(i);
    if (!data) return false;
    this.setActiveSlot(i);
    RUN.startRun(typeof data.classIdx === 'number' ? data.classIdx : 0);
    if (typeof data.bossIdx === 'number') RUN.bossIdx = data.bossIdx;
    if (typeof data.levelIdx === 'number') RUN.levelIdx = data.levelIdx;
    if (Array.isArray(data.relics)) RUN.relics = data.relics.map(Boolean);
    if (Array.isArray(data.bestTimesMs))
      RUN.bestTimesMs = data.bestTimesMs.map((t) => (typeof t === 'number' ? t : null));
    if (Array.isArray(data.weapons) && data.weapons.length > 0) {
      RUN.weapons = [...data.weapons];
      RUN.equippedWeapon = data.equippedWeapon ?? data.weapons[0]!;
    }
    if (Array.isArray(data.items)) RUN.items = [...data.items];
    if (data.quickItem) RUN.quickItem = data.quickItem;
    if (Array.isArray(data.buffs)) RUN.buffs = [...data.buffs];
    if (Array.isArray(data.foundSecrets)) RUN.foundSecrets = [...data.foundSecrets];
    if (Array.isArray(data.completedLevels))
      RUN.completedLevels = data.completedLevels.map((row) =>
        Array.isArray(row) ? row.map(Boolean) : [],
      );
    return true;
  },

  /** Scrive RUN nello slot attivo. */
  save(): void {
    const s = storage();
    if (!s) return;
    try {
      const data: SlotData = {
        version: 2,
        classIdx: RUN.classIdx,
        bossIdx: RUN.bossIdx,
        levelIdx: RUN.levelIdx,
        relics: [...RUN.relics],
        bestTimesMs: [...RUN.bestTimesMs],
        weapons: [...RUN.weapons],
        equippedWeapon: RUN.equippedWeapon,
        items: [...RUN.items],
        quickItem: RUN.quickItem,
        buffs: [...RUN.buffs],
        foundSecrets: [...RUN.foundSecrets],
        completedLevels: RUN.completedLevels.map((r) => [...r]),
      };
      s.setItem(SLOT_KEY(activeSlot), JSON.stringify(data));
    } catch {
      /* storage pieno o negato */
    }
  },

  summary(i: number): SlotSummary {
    const data = readSlot(i);
    if (!data) return { exists: false, classIdx: 0, bossIdx: 0, levelIdx: 0, relics: 0 };
    return {
      exists: true,
      classIdx: data.classIdx ?? 0,
      bossIdx: data.bossIdx ?? 0,
      levelIdx: data.levelIdx ?? 0,
      relics: (data.relics ?? []).filter(Boolean).length,
    };
  },

  hasAnySlot(): boolean {
    for (let i = 0; i < SLOT_COUNT; i++) if (readSlot(i)) return true;
    return false;
  },

  deleteSlot(i: number): void {
    storage()?.removeItem(SLOT_KEY(i));
  },

  /** Reset esplicito dalle impostazioni: tutti gli slot + impostazioni. */
  reset(): void {
    for (let i = 0; i < SLOT_COUNT; i++) this.deleteSlot(i);
    storage()?.removeItem(SETTINGS_KEY);
    RUN.startRun(0);
    RUN.bestTimesMs = new Array<number | null>(BOSS_COUNT).fill(null);
    applySettings(DEFAULT_SETTINGS);
  },

  /** C'è una run da riprendere nello slot attivo (in RUN)? */
  hasRunInProgress(): boolean {
    return !RUN.isComplete;
  },
};
