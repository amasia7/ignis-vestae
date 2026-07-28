import type { Action } from '../input/actions';

/** Impostazioni persistite: volume, effetti schermo, tasti rimappati. */
export interface SettingsData {
  /** 0..1, applicato ai beep WebAudio. */
  volume: number;
  /** false = niente shake della camera. */
  screenShake: boolean;
  /** Override dei binding di default: azione → nomi tasto Phaser. */
  bindings: Partial<Record<Action, readonly string[]>>;
}

export const DEFAULT_SETTINGS: SettingsData = {
  volume: 1,
  screenShake: true,
  bindings: {},
};

/** Stato corrente (mutato da SettingsScene, persistito da SaveManager). */
export const settings: SettingsData = {
  ...DEFAULT_SETTINGS,
  bindings: { ...DEFAULT_SETTINGS.bindings },
};

export function applySettings(next: Partial<SettingsData>): void {
  if (next.volume !== undefined) settings.volume = Math.max(0, Math.min(1, next.volume));
  if (next.screenShake !== undefined) settings.screenShake = next.screenShake;
  if (next.bindings !== undefined) settings.bindings = { ...next.bindings };
}
