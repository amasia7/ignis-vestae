import type Phaser from 'phaser';
import { settings } from '../core/settings';
import { getAudioContext, initAudio } from './audio';

/**
 * Musica procedurale in WebAudio, pensata per lunghe sessioni: volumi bassi,
 * passi lenti, nessuna melodia insistente. Due tracce:
 *   `title` — il canto al braciere del menu;
 *   `game`  — un tappeto quieto per i livelli e le boss fight.
 *
 * Come per le texture, un file reale VINCE sulla musica procedurale:
 * metti `assets/audio/title.ogg` (o .mp3) e/o `assets/audio/game.ogg`
 * e diventano le tracce, senza toccare codice. Chiavi riservate per il
 * futuro: world1..world3, boss1..boss3.
 */
const AUDIO_FILES = import.meta.glob('/assets/audio/*.{ogg,mp3}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export function audioFileFor(key: string): string | null {
  return AUDIO_FILES[`/assets/audio/${key}.ogg`] ?? AUDIO_FILES[`/assets/audio/${key}.mp3`] ?? null;
}

export type MusicKey = 'title' | 'game';

interface TrackDef {
  /** Bordone di fondo (frequenze in Hz) e suo guadagno. */
  readonly drones: readonly number[];
  readonly droneGain: number;
  /** Scala della salmodia e cadenza (ms tra una nota e l'altra). */
  readonly notes: readonly number[];
  readonly noteEveryMs: number;
  readonly noteGain: number;
  readonly noteDurS: number;
  /** Rintocco grave ogni N note (0 = mai). */
  readonly bellEvery: number;
  readonly bellFreq: number;
  /** Volume complessivo della traccia (moltiplica settings.volume). */
  readonly volume: number;
}

const TRACKS: Readonly<Record<MusicKey, TrackDef>> = {
  // il canto al braciere: due voci gravi e una salmodia rada
  title: {
    drones: [73.42, 110.0], // D2 + A2
    droneGain: 0.3,
    notes: [293.66, 349.23, 392.0, 440.0], // D4 F4 G4 A4
    noteEveryMs: 3200,
    noteGain: 0.18,
    noteDurS: 5,
    bellEvery: 4,
    bellFreq: 146.83, // D3
    volume: 0.12,
  },
  // il tappeto dei livelli: ancora più quieto, note basse e lontane,
  // fatto per non stancare in sessioni lunghe
  game: {
    drones: [73.42], // solo D2
    droneGain: 0.24,
    notes: [146.83, 174.61, 196.0, 220.0], // D3 F3 G3 A3
    noteEveryMs: 5400,
    noteGain: 0.13,
    noteDurS: 7,
    bellEvery: 0,
    bellFreq: 0,
    volume: 0.09,
  },
};

let currentKey: MusicKey | null = null;
let fileAudio: HTMLAudioElement | null = null;
let master: GainNode | null = null;
let drones: OscillatorNode[] = [];
let timer: ReturnType<typeof setInterval> | null = null;
let step = 0;

function playNote(ctx: AudioContext, freq: number, gain: number, durS: number): void {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(freq, ctx.currentTime);
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.7); // attacco morbido
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durS);
  o.connect(g).connect(master ?? ctx.destination);
  o.start();
  o.stop(ctx.currentTime + durS);
}

/** Avvia (o cambia) la traccia. Idempotente: la stessa chiave non riparte. */
export function startMusic(key: MusicKey): void {
  if (currentKey === key && (fileAudio || master)) return;
  stopMusic();
  currentKey = key;

  // un file in assets/audio vince sulla musica procedurale
  const fileUrl = audioFileFor(key);
  if (fileUrl) {
    fileAudio = new Audio(fileUrl);
    fileAudio.loop = true;
    fileAudio.volume = Math.min(1, 0.7 * settings.volume);
    // il browser può negare l'avvio prima del primo gesto: si riproverà
    fileAudio.play().catch(() => {
      fileAudio = null;
      currentKey = null;
    });
    return;
  }

  initAudio();
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') {
    currentKey = null; // niente audio sbloccato: si riproverà
    return;
  }

  const def = TRACKS[key];
  const vol = (): number => def.volume * settings.volume;
  master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.linearRampToValueAtTime(vol(), ctx.currentTime + 2.5);
  master.connect(ctx.destination);

  // bordone: voci gravi appena scordate tra loro
  drones = def.drones.map((f) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(f, ctx.currentTime);
    o.detune.setValueAtTime(Math.random() * 6 - 3, ctx.currentTime);
    g.gain.setValueAtTime(def.droneGain, ctx.currentTime);
    o.connect(g).connect(master!);
    o.start();
    return o;
  });

  // salmodia: passo lento e quasi casuale sulla scala
  step = 0;
  timer = setInterval(() => {
    const c = getAudioContext();
    if (!c || !master) return;
    master.gain.setTargetAtTime(vol(), c.currentTime, 0.2);
    const idx = Math.floor(Math.random() * def.notes.length);
    playNote(c, def.notes[idx]!, def.noteGain, def.noteDurS);
    if (def.bellEvery > 0 && step % def.bellEvery === def.bellEvery - 1)
      playNote(c, def.bellFreq, def.noteGain * 1.4, def.noteDurS + 1.5);
    step++;
  }, def.noteEveryMs);
}

export function stopMusic(): void {
  currentKey = null;
  if (fileAudio) {
    fileAudio.pause();
    fileAudio = null;
  }
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

/**
 * Aggancia la traccia a una scena: prova subito e a ogni primo input
 * (i browser sbloccano l'audio solo dopo un gesto dell'utente).
 */
export function sceneMusic(scene: Phaser.Scene, key: MusicKey): void {
  startMusic(key);
  const retry = (): void => startMusic(key);
  scene.input.keyboard?.on('keydown', retry);
  scene.input.on('pointerdown', retry);
  scene.events.once('shutdown', () => {
    scene.input.keyboard?.off('keydown', retry);
    scene.input.off('pointerdown', retry);
  });
}
