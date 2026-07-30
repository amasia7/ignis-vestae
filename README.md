# Ignis Vestae

> _L'ultima fiamma di Roma_ — un souls-like 2D a arene sulla lore delle Vestali romane.

Tre classi, tre boss, tre reliquie. Migrazione completa del prototipo a file
singolo (`legacy/ignis-vestae.html`, tuttora il riferimento funzionale) verso
Vite + TypeScript strict + Phaser 3, **senza cambiare game feel, testi o
meccaniche**.

## Avvio rapido

```bash
npm install
npm run dev          # gioco su http://localhost:5173
npm run art:preview  # tutte le texture su griglia, isolate dal gioco
```

Comandi in gioco: `◀ ▶` muoversi · `↑` salto · `A` colpo (tieni premuto:
pesante) · `Q` scudo (classi pesanti) · `S` schivata · `H` ampolla · `E`
abilità · `F` oggetto rapido · `C` cambia oggetto rapido · `B` borsa ·
`ESC` pausa (il recap è sempre visibile in alto a sinistra). Col mouse:
sinistro colpo (tieni: pesante), destro schivata o scudo secondo la
classe, rotella oggetto rapido. Touch e gamepad supportati; tasti
rimappabili dalle impostazioni (`O` dal titolo).

La run: **tre mondi, tre mini cammini con platforming ciascuno**
(piattaforme sospese, trincee di braci, durata crescente, sfondo condiviso
per mondo), popolati da un mix di **guerrieri e arcieri**, poi il custode
del mondo — telegrafi colorati per tipo di schivata e **fase 2** dai boss
successivi al primo. Nei
cammini si nascondono **urne segrete** (un'arma e una benedizione per
mondo: spezzale con un colpo) e ogni custode lascia un **bottino**
(arma o benedizione permanente). Le **armi sono staccate dal
personaggio**: slot dedicato nell'HUD, gestione dalla borsa (`B`).
Dal menu: **3 slot di salvataggio** e la rigiocata dei **cammini
completati** (voce LIVELLI).

In dev, `F1` in combattimento apre l'overlay di debug (FPS, hitbox, stati,
salto ai boss, hp del boss). È escluso dalla build di produzione.

## Script

| Comando                                          | Cosa fa                                                     |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `npm run dev` / `build` / `preview`              | dev server, build statica in `dist/`, anteprima della build |
| `npm run lint` / `format` / `typecheck` / `test` | qualità: ESLint, Prettier, tsc, Vitest                      |
| `npm run art:preview`                            | anteprima di tutte le texture del manifest                  |
| `npm run assets:check`                           | valida i PNG in `assets/` contro il manifest (usato in CI)  |
| `npm run new:boss -- nome-boss`                  | scaffolding: dati + entità + registrazione + texture + test |
| `npm run new:class -- nome-classe`               | scaffolding: voce classe + testi stub + artwork placeholder |
| `npm run new:scene -- nome-scena`                | scaffolding: scena + registrazione in main.ts               |

## Architettura in breve

- **`src/config/balance.ts`** — _tutti_ i numeri di tuning, un solo posto,
  ogni valore con il riferimento alla riga del legacy.
- **`src/data/`** — classi, boss (pattern data-driven), reliquie e ogni
  stringa a schermo (`strings.it.ts`; i18n pronto per `strings.en.ts`).
- **`src/core/`** — StateMachine a millisecondi, EventBus tipizzato,
  RunState, SaveManager (localStorage), stamina e danno come logica pura.
- **`src/input/`** — azioni astratte servite da tastiera, pad touch e
  gamepad; coyote time e jump buffer in un modulo puro testato a 30/60/144 fps.
- **`src/art/`** — il manifest `registry.ts` mappa ogni chiave texture a un
  generatore procedurale **oppure** a un file: metti `assets/<chiave>.png`
  e quel file vince, senza toccare il codice. Dimensioni, origine e (per gli
  spritesheet futuri) frame sono dichiarati nel manifest.
- **`src/entities/` + `src/scenes/`** — Player, boss e scene, port fedele
  del legacy; HUD come scena separata.

Documentazione completa in `docs/ARCHITECTURE.md`; piano e criteri di
accettazione in `docs/MIGRATION-PLAN.md`; note su valori dubbi e bug legacy
in `docs/BALANCE-NOTES.md` e `docs/KNOWN-ISSUES.md`. Per generare artwork e
musica con un'altra AI: `docs/AI-ASSETS.md`. Piano di espansione:
`docs/ROADMAP.md`.

## Sostituire un artwork

Il flusso completo via GitHub (upload → CI che valida → merge → deploy) è
in `docs/ASSET-PIPELINE.md`. In breve:

1. guarda la chiave in `npm run art:preview` (es. `equus`, 190×120);
2. crea `assets/equus.png` con le stesse dimensioni;
3. ricarica: il file vince sul generatore procedurale. Fine.

Per gli spritesheet: aggiungi `frames: { count, rate }` alla voce del
manifest e fornisci il PNG a strisce orizzontali.

## Deploy

La build è statica (`npm run build` → `dist/`, percorsi relativi):

- **GitHub Pages**: una volta sola, in _Settings → Pages_ imposta
  _Source: GitHub Actions_. Il workflow `deploy-pages.yml` pubblica a ogni
  push su `main` (o manualmente con _Run workflow_ da qualsiasi branch).
- **itch.io**: comprimi il contenuto di `dist/` in uno zip e caricalo come
  progetto HTML (viewport 960×540).

## Il legacy

`legacy/ignis-vestae.html` è il prototipo originale e la specifica
autorevole: non va modificato né cancellato finché la migrazione non è
validata. I test in `tests/legacy-fidelity.test.ts` estraggono testi e
valori direttamente da quel file e li confrontano con i moduli migrati.
