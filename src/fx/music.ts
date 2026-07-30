import { settings } from '../core/settings';
import { getAudioContext, initAudio } from './audio';

/**
 * Musica d'intro sintetizzata in WebAudio, nello stesso linguaggio sonoro
 * dei beep di gioco: un bordone grave (re) e una salmodia lenta su scala
 * minore, come un canto al braciere. Nessun file audio: tutto procedurale.
 */
const DRONE_FREQS = [73.42, 110.0]; // D2 + A2
const NOTES = [293.66, 349.23, 392.0, 440.0, 523.25]; // D4 F4 G4 A4 C5
const NOTE_EVERY_MS = 2100;

let master: GainNode | null = null;
let drones: OscillatorNode[] = [];
let timer: ReturnType<typeof setInterval> | null = null;
let step = 0;

function volume(): number {
  return 0.14 * settings.volume;
}

function playNote(ctx: AudioContext, freq: number, gain: number, durS: number): void {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(freq, ctx.currentTime);
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.5); // attacco morbido
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durS);
  o.connect(g).connect(master ?? ctx.destination);
  o.start();
  o.stop(ctx.currentTime + durS);
}

/** Avvia la musica del titolo (idempotente; parte solo ad audio sbloccato). */
export function startTitleMusic(): void {
  initAudio();
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running' || master) return;

  master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.linearRampToValueAtTime(volume(), ctx.currentTime + 2);
  master.connect(ctx.destination);

  // bordone: due voci gravi appena scordate tra loro
  drones = DRONE_FREQS.map((f) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(f, ctx.currentTime);
    o.detune.setValueAtTime(Math.random() * 6 - 3, ctx.currentTime);
    g.gain.setValueAtTime(0.32, ctx.currentTime);
    o.connect(g).connect(master!);
    o.start();
    return o;
  });

  // salmodia: passo lento e quasi casuale sulla scala, con una campana grave
  step = 0;
  timer = setInterval(() => {
    const c = getAudioContext();
    if (!c || !master) return;
    master.gain.setTargetAtTime(volume(), c.currentTime, 0.2);
    const idx = Math.min(
      NOTES.length - 1,
      Math.max(0, (step % 2 === 0 ? 0 : 2) + Math.floor(Math.random() * 3)),
    );
    playNote(c, NOTES[idx]!, 0.22, 4.5);
    if (step % 4 === 3) playNote(c, 146.83, 0.3, 6); // D3, il rintocco
    step++;
  }, NOTE_EVERY_MS);
}

export function stopTitleMusic(): void {
  const ctx = getAudioContext();
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (ctx && master) {
    const m = master;
    m.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.25);
    const oldDrones = drones;
    setTimeout(() => {
      oldDrones.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* già fermo */
        }
      });
      m.disconnect();
    }, 900);
  }
  master = null;
  drones = [];
}
