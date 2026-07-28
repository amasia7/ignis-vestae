import { BOSS_COUNT, RUN } from './RunState';
import { DEFAULT_SETTINGS, applySettings, settings, type SettingsData } from './settings';

/**
 * Persistenza su localStorage: classe scelta, boss raggiunto, reliquie,
 * best time per boss, impostazioni. Reset esplicito dalle impostazioni.
 * Tutte le letture/scritture sono difensive: senza storage il gioco
 * funziona come il legacy (nessun salvataggio).
 */
const KEY = 'ignis-vestae:v1';

interface SaveData {
  version: 1;
  classIdx: number;
  bossIdx: number;
  relics: boolean[];
  bestTimesMs: (number | null)[];
  settings: SettingsData;
}

function storage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export const SaveManager = {
  /** Da chiamare una volta all'avvio, prima di creare il gioco. */
  load(): void {
    const s = storage();
    if (!s) return;
    try {
      const raw = s.getItem(KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Partial<SaveData>;
      if (data.version !== 1) return;
      if (typeof data.classIdx === 'number') RUN.classIdx = data.classIdx;
      if (typeof data.bossIdx === 'number') RUN.bossIdx = data.bossIdx;
      if (Array.isArray(data.relics)) RUN.relics = data.relics.map(Boolean);
      if (Array.isArray(data.bestTimesMs))
        RUN.bestTimesMs = data.bestTimesMs.map((t) => (typeof t === 'number' ? t : null));
      if (data.settings) applySettings(data.settings);
    } catch {
      /* salvataggio corrotto: si riparte puliti */
    }
  },

  save(): void {
    const s = storage();
    if (!s) return;
    try {
      const data: SaveData = {
        version: 1,
        classIdx: RUN.classIdx,
        bossIdx: RUN.bossIdx,
        relics: [...RUN.relics],
        bestTimesMs: [...RUN.bestTimesMs],
        settings: { ...settings, bindings: { ...settings.bindings } },
      };
      s.setItem(KEY, JSON.stringify(data));
    } catch {
      /* storage pieno o negato: pazienza */
    }
  },

  /** Reset esplicito: cancella salvataggio, run e impostazioni. */
  reset(): void {
    storage()?.removeItem(KEY);
    RUN.classIdx = 0;
    RUN.bossIdx = 0;
    RUN.relics = new Array<boolean>(BOSS_COUNT).fill(false);
    RUN.bestTimesMs = new Array<number | null>(BOSS_COUNT).fill(null);
    applySettings(DEFAULT_SETTINGS);
  },

  /** C'è una run da riprendere? (boss raggiunto oltre il primo) */
  hasRunInProgress(): boolean {
    return RUN.bossIdx > 0 && RUN.bossIdx < BOSS_COUNT;
  },
};
