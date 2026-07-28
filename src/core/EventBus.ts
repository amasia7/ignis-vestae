import type { SettingsData } from './settings';

/** Emettitore di eventi tipizzato, senza dipendenze da Phaser. */
export class EventBus<E extends Record<string, unknown>> {
  private listeners = new Map<keyof E, Set<(payload: never) => void>>();

  on<K extends keyof E>(event: K, fn: (payload: E[K]) => void): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(fn as (payload: never) => void);
    return () => this.off(event, fn);
  }

  off<K extends keyof E>(event: K, fn: (payload: E[K]) => void): void {
    this.listeners.get(event)?.delete(fn as (payload: never) => void);
  }

  emit<K extends keyof E>(event: K, payload: E[K]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const fn of [...set]) (fn as (payload: E[K]) => void)(payload);
  }

  clear(): void {
    this.listeners.clear();
  }
}

/** Gli eventi di gioco. Le scene si parlano solo attraverso questi. */
export type GameEvents = {
  'player:hurt': { hp: number; maxHp: number; damage: number };
  'player:death': { classIdx: number };
  'boss:hurt': { hp: number; maxHp: number };
  'boss:death': { bossIdx: number; fightTimeMs: number };
  'relic:gained': { relicIdx: number };
  'settings:changed': SettingsData;
};

export const gameEvents = new EventBus<GameEvents>();
