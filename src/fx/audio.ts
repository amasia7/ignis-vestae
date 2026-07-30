import { settings } from '../core/settings';

/**
 * Beep sintetici WebAudio, port esatto del legacy (r. 77-90) con in più il
 * volume delle impostazioni applicato al gain.
 */
type BeepType = OscillatorType;

let AC: AudioContext | null = null;

export function initAudio(): void {
  try {
    interface WebkitWindow {
      webkitAudioContext?: typeof AudioContext;
    }
    const Ctor = window.AudioContext ?? (window as unknown as WebkitWindow).webkitAudioContext;
    if (!Ctor) return;
    AC = AC ?? new Ctor();
    if (AC.state === 'suspended') void AC.resume();
  } catch {
    /* niente audio, nessun errore fatale (come il legacy) */
  }
}

/** Contesto WebAudio condiviso (null finché il primo gesto non lo sblocca). */
export function getAudioContext(): AudioContext | null {
  return AC;
}

export function beep(f: number, d: number, type?: BeepType, g?: number, slide?: number): void {
  if (!AC || settings.volume <= 0) return;
  try {
    const o = AC.createOscillator();
    const v = AC.createGain();
    o.type = type ?? 'square';
    o.frequency.setValueAtTime(f, AC.currentTime);
    if (slide) o.frequency.linearRampToValueAtTime(Math.max(30, f + slide), AC.currentTime + d);
    v.gain.setValueAtTime((g ?? 0.04) * settings.volume, AC.currentTime);
    v.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + d);
    o.connect(v).connect(AC.destination);
    o.start();
    o.stop(AC.currentTime + d);
  } catch {
    /* ignora, come il legacy */
  }
}

/** Sblocco dell'audio al primo gesto, come il legacy (r. 89-90). */
export function installAudioUnlock(): void {
  document.addEventListener('pointerdown', initAudio, { passive: true });
  document.addEventListener('keydown', initAudio);
}
