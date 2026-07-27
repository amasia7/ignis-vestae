# Ignis Vestae — Architettura di destinazione

> Fase 0 della migrazione. Questo documento propone la struttura definitiva del progetto.
> La specifica funzionale autorevole resta `legacy/ignis-vestae.html`: ogni valore e ogni
> testo citato qui è stato letto da lì, non ricostruito a memoria.

## 1. Visione d'insieme

Il legacy è un singolo file da ~1000 righe organizzato in 6 sezioni (costanti/dati, audio,
asset registry, input, entità, scene). La migrazione conserva **esattamente** quella
semantica e la distribuisce in moduli TypeScript `strict`, con tre separazioni nette:

1. **Dati vs logica** — tutti i numeri di tuning in `config/balance.ts`, tutti i testi in
   `data/strings.it.ts` + `data/lore.ts`, i pattern dei boss come dati in `data/bosses.ts`.
2. **Arte vs gioco** — ogni texture ha una chiave nel manifest `art/registry.ts`; il gioco
   conosce solo le chiavi. Un artwork si sostituisce mettendo un file in `assets/`, senza
   toccare il codice.
3. **Logica pura vs Phaser** — StateMachine, timer di input (coyote/jump buffer), stamina,
   calcolo danno e progressione della run non importano Phaser e sono testabili con Vitest.

## 2. Struttura delle cartelle

```
src/
  main.ts                    # config Phaser, registrazione scene (da legacy: W/H, gravity 1500, Scale.FIT, activePointers 4)
  config/
    game.config.ts           # W=960, H=540, GROUND=460, gravità, colori di fondo, scale mode
    balance.ts               # TUTTI i numeri di tuning, un solo posto (vedi §7)
  data/
    classes.ts               # le 3 classi (VESTALE / SACERDOTE RINNEGATO / ARUSPICE), tipizzate
    bosses.ts                # parametri e pattern dei boss, data-driven (vedi §5)
    relics.ts                # le 3 reliquie: testo + effetto meccanico dichiarativo
    lore.ts                  # prologo (3 pagine), nomi arene, testi vittoria
    strings.it.ts            # ogni stringa mostrata a schermo, chiave → testo italiano
    i18n.ts                  # selettore lingua; oggi restituisce solo strings.it
  core/
    StateMachine.ts          # macchina a stati riusabile, tick in ms, at()/onEnter/onUpdate/onExit
    EventBus.ts              # eventi di gioco tipizzati (danno, morte boss, morte player, reliquia…)
    RunState.ts              # stato della run: classe, boss corrente, reliquie (oggi: oggetto RUN)
    SaveManager.ts           # persistenza su localStorage (nuovo)
    combat.ts                # funzioni pure: calcolo danno (base × mult × reliquia), hit test
    stamina.ts               # consumo/rigenerazione stamina come modulo puro
  input/
    InputManager.ts          # azioni astratte held/just-pressed; coyote time e jump buffer vivono qui
    KeyboardSource.ts        # A/D/W/J/K/L/H/U/R + frecce + SPACE + ENTER (come legacy)
    VirtualPad.ts            # pad touch (layout e alpha identici al legacy VPad)
    GamepadSource.ts         # nuovo: gamepad via Phaser Input.Gamepad
    bindings.ts              # mappatura azione → tasti, rimappabile e salvabile
  entities/
    Player.ts                # stati: free/roll/attL/attH/heal/cast/smite/hurt (identici al legacy)
    bosses/BossBase.ts       # x, face, glow, flash, clamp [60, W-60], interprete dei pattern
    bosses/Equus.ts          # carica / impennata / soffio di fuoco
    bosses/Cornelia.ts       # mani dal terreno / afferrata / urlo / teletrasporto (→ grab)
    bosses/Palladio.ts       # combo lancia / lancia scagliata / salto-schianto / risveglio fase 2
    hazards/Flame.ts         # fiamma a terra (vita 4000ms, danno 7, tick 750ms)
    hazards/Spear.ts         # lancia (danno 15, kb vx·0.45)
    hazards/Wave.ts          # onda d'urto (danno 14, kb vx·0.5)
    hazards/Bolt.ts          # dardo della giocatrice (danno 26·mult)
  scenes/
    BootScene.ts             # genera le texture dal registry (o carica i file reali)
    PreloadScene.ts          # caricamento asset da file, barra di attesa (nuova, oggi non serve)
    TitleScene.ts  SelectScene.ts  LoreScene.ts
    FightScene.ts            # arena, boss, hazards, collisioni — senza HUD
    HudScene.ts              # HUD come scena sovrapposta (oggi: drawHud dentro Fight)
    InterludeScene.ts  VictoryScene.ts
    PauseScene.ts            # nuova: pausa con ESC
    SettingsScene.ts         # nuova: volume, shake on/off, rimappatura
  art/
    registry.ts              # manifest: chiave → {generator | file, w, h, origin, frames?, frameRate?}
    generated/               # un file per disegno: vestale.ts, sacerdote.ts, aruspice.ts,
                             #   equus.ts, cornelia.ts (ghost), palladio.ts (statue), hand.ts,
                             #   weapons.ts (wp0/wp1/wp2), fx.ts (dot/ring/slash/bolt/warn/flameglow),
                             #   ui.ts (btn/btnsm), props.ts (brazier/spear)
    preview/                 # pagina art:preview (entry Vite separata)
  ui/
    Bar.ts                   # barre HP/stamina/boss (stessi colori e misure del legacy)
    Banner.ts                # banner nome boss / CUSTODE ANNIENTATO
    Card.ts                  # carta di selezione classe
    Flasks.ts                # indicatore ampolle
    AbilityIcon.ts           # icona abilità con ricarica a spicchio
  fx/
    particles.ts             # puff() e ringFx() del legacy
    screenShake.ts           # wrapper dello shake camera, disattivabile dalle impostazioni
    audio.ts                 # beep sintetici WebAudio (stessi parametri), volume regolabile
  debug/
    DebugOverlay.ts          # solo dev: FPS, hitbox, stati, slider HP boss, salto scena
assets/                      # sprite reali, quando verranno prodotti (vince sul generatore)
docs/
tests/
scripts/                     # new-boss.mjs, new-class.mjs, new-scene.mjs (scaffolding)
legacy/ignis-vestae.html     # NON toccare finché la migrazione non è validata
```

Scostamenti rispetto alla struttura proposta nel brief (tutti additivi, nessuna rimozione):

- `data/relics.ts` separato da `lore.ts`: le reliquie hanno sia testo sia effetto meccanico,
  meritano un modulo con entrambe le facce vicine.
- `core/combat.ts` e `core/stamina.ts`: logica pura estratta per i test richiesti
  (danno, stamina) senza dipendere da Phaser.
- `input/KeyboardSource.ts` e `input/GamepadSource.ts`: l'InputManager aggrega sorgenti
  omogenee invece di conoscerle tutte.
- `scenes/PauseScene.ts`, `scenes/SettingsScene.ts`, `debug/DebugOverlay.ts`: richiesti
  nella sezione "cose da aggiungere".
- `art/preview/`: entry HTML separata per `npm run art:preview`.

## 3. Input

`InputManager` espone azioni astratte:

```ts
type Action =
  | 'MOVE_LEFT' | 'MOVE_RIGHT' | 'JUMP' | 'LIGHT' | 'HEAVY'
  | 'ROLL' | 'HEAL' | 'ABILITY' | 'CONFIRM' | 'PAUSE';

isHeld(a: Action): boolean
justPressed(a: Action): boolean   // consumato una volta per frame, come JustDown/consume() legacy
```

- Le sorgenti (tastiera, VPad, gamepad) traducono i loro eventi in azioni tramite
  `bindings.ts`; l'InputManager fa l'OR. Nessuna entità legge mai un tasto.
- **Coyote time (90ms) e jump buffer (130ms)** vivono in un modulo puro
  (`input/jumpTimers.ts` o dentro InputManager) aggiornato in millisecondi, così i test
  a 30/60/144 fps sono semplici. Il Player consuma solo `wantsJump()`.
- Particolarità legacy da conservare: su touch `jumpHeld()` è sempre vero, quindi il
  taglio del salto (velocityY riportata a −220 al rilascio) non esiste su touch. Va
  replicato tale e quale.
- Gamepad (nuovo): stick/d-pad → MOVE, A → JUMP, X → LIGHT, Y → HEAVY, B/RB → ROLL,
  LB → HEAL, RT → ABILITY, Start → PAUSE. Mappatura rimappabile come la tastiera.

## 4. StateMachine

Player e boss nel legacy condividono la stessa forma: `stato` + `tempo nello stato (sT/aT)` +
soglie in ms + flag `evDone/hitDone/fxDone` + condizione di uscita. Estrazione:

```ts
const sm = new StateMachine<PlayerStateId>({
  attL: {
    onEnter: (ctx) => {
      /* … */
    },
    at: [
      [110, (ctx) => ctx.slashFx(0.75)], // evento one-shot a t=110ms
    ],
    during: [
      [110, 220, (ctx) => ctx.openHitbox('attL')], // finestra attiva
    ],
    onUpdate: (dt, ctx) => {
      /* … */
    },
    exitAfter: 340, // oppure exitWhen: (ctx) => …
    next: 'free',
  },
});
sm.update(dt); // dt in ms, accumulo interno del tempo nello stato
```

- `at(t, fn)` scatta una sola volta quando il tempo nello stato supera `t` (equivalente
  di `if(!this.evDone && this.sT>=…)`), anche con dt grandi: nessun evento perso.
- `during(t0, t1, fn)` esprime le finestre (i-frame del roll 50–300ms, hitbox degli
  attacchi) in modo dichiarativo e testabile.
- I moltiplicatori di velocità dei boss (`sp` = 0.75 / 0.72 / 0.68) scalano le soglie
  esattamente come nel legacy: le durate parametriche restano espressioni sui dati,
  la StateMachine riceve i valori già scalati all'ingresso nello stato.

## 5. Boss data-driven

I numeri e le probabilità diventano dati in `data/bosses.ts`; le classi in
`entities/bosses/` interpretano i dati e implementano solo il comportamento non
esprimibile come numero (movimento della carica, interpolazione del salto, tween).

```ts
interface BossData {
  key: 'equus' | 'cornelia' | 'palladio';
  nameKey: string;
  subKey: string; // → strings.it.ts
  hp: number; // 300 / 340 / 460
  hurtbox: { w: number; h: number; ox: number; oy: number };
  phase2: { trigger: number; speedMult: number /* 150(hp<mhp/2) 170 230 ; 0.75 0.72 0.68 */ };
  idle: { moveSpeed: number; stopDistance?: number };
  attacks: Record<string, AttackData>; // windup, finestre, danno, knockback, cooldown
  selector: SelectorRule[]; // le regole di scelta, distanze e probabilità ESATTE
}
```

Il selettore replica **letteralmente** gli alberi decisionali del legacy, compreso
l'ordine delle estrazioni casuali (che ne determina le probabilità composte):

- **Equus**: `d>300 || rand<0.3` → carica; altrimenti `rand<0.5` → impennata, altrimenti soffio.
- **Cornelia**: `d<160` → `rand<0.6` urlo / grab; altrimenti `r<0.5` mani, `r<0.8` teletrasporto, altrimenti grab. Il teletrasporto concatena sempre in grab.
- **Palladio**: `d>260` → (fase2 && `rand<0.45` → slam) altrimenti lancia; altrimenti fase2 && `rand<0.25` → slam; altrimenti combo (2 colpi in fase 1, 3 in fase 2).

Obiettivo verificabile: aggiungere un quarto boss = un file dati + una sottoclasse solo
se serve comportamento nuovo; ribilanciare = toccare solo `data/bosses.ts`.

## 6. Pipeline degli asset

Il punto più importante per il committente. Manifest in `art/registry.ts`:

```ts
interface TextureEntry {
  key: string; // es. 'equus'
  size: [w: number, h: number]; // da ASSET_SIZE legacy
  origin: [x: number, y: number]; // es. [0.5, 1] per i personaggi coi piedi a terra
  generator?: (g: Graphics) => void; // da art/generated/*
  file?: string; // 'assets/equus.png' — se esiste, VINCE
  frames?: { count: number; rate: number }; // per spritesheet futuri
}
```

- **Risoluzione**: in `BootScene`, per ogni entry: se `file` è dichiarato e il file esiste
  nel bundle → `load.image`/`load.spritesheet`; altrimenti → genera la texture dal
  generatore procedurale (identico a oggi). Il codice di gioco usa solo `key`.
- Le 20 texture legacy (`dot ring btn btnsm pl0 pl1 pl2 wp0 wp1 wp2 slash bolt equus
ghost hand statue spear warn flameglow brazier`) migrano ciascuna nel proprio file in
  `art/generated/`, con le stesse dimensioni di `ASSET_SIZE` e lo stesso disegno,
  incluso l'helper condiviso `robedFigure` (44×70, piedi a y=70).
- **`npm run art:preview`**: seconda entry Vite (`art/preview/index.html`) che istanzia un
  mini-Phaser, genera tutte le texture del registry e le affianca su griglia con nome,
  dimensioni e origine, sfondo a scacchi. Nessuna dipendenza dal codice di gioco.
- Test di integrità (Vitest): ogni chiave passata a `add.image/add.sprite` nel sorgente
  esiste nel registry (scansione statica dei letterali + elenco chiavi).

## 7. `config/balance.ts` — un solo posto per i numeri

Contiene, raggruppati e con i nomi del legacy a commento:

- **Mondo**: W 960, H 540, GROUND 460, gravità 1500, bounds fisica `[30, −400, W−60, GROUND+400]`.
- **Player**: jump −560, jump-cut −220, coyote 90, jump buffer 130, drag 2400, accel 2800,
  roll (velocità 580, maxVel 620, durata 380, i-frame 50–300, costo 25),
  attL (costo 14, danno 9, finestra 110–220, fine 340, box 78×70),
  attH (costo 28, danno 20, finestra 300–450, fine 620, box 96×82),
  heal (+45 a t=550, fine 820), hurt (inv 900, stun 350, kb −140 verticale),
  stamina regen 55/s, fiamma (danno 7, tick 750), maxVel.y 1000.
- **Classi**: hp/st/mult/spd/fl/cd delle tre classi (100/100/1/265/4/8000 —
  135/90/1.25/215/3/12000 — 80/115/0.85/325/4/14000), haste Aruspice (×1.45, 2500ms,
  inv 2500), smite (danno 40·mult, raggio 135, evento a 360, fine 700),
  cast (evento a 240, fine 480, dardo vx 560, danno 26·mult).
- **Reliquie**: SUFFIMEN +1 ampolla, MOLA SALSA mult ×1.4, IL PALLADIO (narrativa).
- **Boss**: tutti i valori elencati in §5 e nel piano di migrazione (windup, durate,
  cooldown, danni, knockback, raggi, velocità), in millisecondi come nel legacy.

Regola: nessun numero di gameplay hardcoded fuori da questo file e da `data/bosses.ts`
(che da questo importa). I valori sospetti si annotano in `docs/BALANCE-NOTES.md`, non si
correggono.

## 8. Scene e flusso

```
Boot → (Preload) → Title → Select → Lore(3 pagine) → Fight(boss 0)
  Fight: morte → overlay morte → restart della stessa Fight
  Fight: vittoria → Interlude(reliquia) → Fight(boss+1) | Victory → Title
HudScene: lanciata sopra Fight (scene.launch), legge il modello via EventBus
PauseScene: ESC sospende Fight+Hud, overlay con riprendi/impostazioni/abbandona
```

`RunState` sostituisce l'oggetto globale `RUN` (`cls`, `bossIdx`, `relics[3]`) e
`SaveManager` lo persiste: classe scelta, boss raggiunto, reliquie, best time per boss,
più impostazioni e bindings. Reset esplicito dalle impostazioni.

## 9. EventBus

Eventi tipizzati minimi: `player:hurt`, `player:death`, `player:heal`, `boss:hurt`,
`boss:death`, `relic:gained`, `stamina:blocked`, `run:advance`, `settings:changed`.
Usi: HUD disaccoppiata da Fight, SaveManager che ascolta `boss:death` per i best time,
audio/shake che rispettano le impostazioni.

## 10. i18n

`strings.it.ts` esporta un oggetto tipizzato `Strings`; `i18n.ts` espone `t(key)` e la
lingua attiva. Aggiungere l'inglese domani = creare `strings.en.ts` che implementa la
stessa interfaccia. Oggi nessuna traduzione. I testi con caratteri Unicode escaped nel
legacy (`’` ecc.) vengono trascritti come caratteri reali UTF-8, verificando
l'equivalenza carattere per carattere.

## 11. Debug overlay (solo dev)

Attivabile con un tasto (proposta: F1) solo se `import.meta.env.DEV`. Mostra FPS, hitbox e
hurtbox, stato+tempo nello stato di player e boss, slider HP boss, salto rapido a
scena/boss. Il codice sta in `debug/` ed è importato con `import()` dinamico dietro il
flag, così Vite lo esclude dalla build di produzione (tree-shaking verificabile
ispezionando il bundle).

## 12. Test (Vitest, logica pura)

- danno: base × mult classe × reliquia (9·1.25·1.4 ecc.), smite e bolt inclusi;
- stamina: costi 25/14/28, regen 55/s solo in stato `free`, blocco azioni sotto soglia;
- StateMachine: transizioni, eventi `at()` non persi con dt grandi, finestre `during()`
  (i-frame roll 50–300) inclusivi come nel legacy (`>=` e `<=`);
- coyote/jump buffer: comportamento equivalente a 30/60/144 fps (dt 33.3/16.7/6.94);
- RunState: reliquia assegnata alla morte del boss, effetti applicati al Player successivo,
  reset a nuova run;
- registry: ogni chiave usata nel codice esiste nel manifest, dimensioni coerenti.

## 13. Toolchain

- Vite (due entry: gioco e art-preview), TypeScript `strict`, Phaser 3 da npm
  (versione 3.60+ — il legacy usa la 3.60.0; eventuali differenze di comportamento con
  la versione npm scelta vanno verificate in Fase 5/6, a parità di API usate).
- ESLint (flat config, `typescript-eslint`) + Prettier, senza plugin extra.
- GitHub Actions: `lint` + `typecheck` + `test` + `build` su push e PR.
- Build statica con `base` relativo, deployabile su GitHub Pages o itch.io.
