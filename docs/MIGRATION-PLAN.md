# Ignis Vestae — Piano di migrazione

Regola generale: **migrazione, non rewrite**. Ogni fase termina con il gioco (o la parte
migrata) verificabile, un commit dedicato, e lo stop in attesa di validazione. Il file
`legacy/ignis-vestae.html` non si tocca e non si cancella: è il riferimento per ogni
confronto.

Criteri trasversali validi per tutte le fasi:

- `npm run lint`, `npm run typecheck`, `npm run test` passano (dalla Fase 1 in poi).
- Nessun valore di tuning modificato: i dubbi si annotano in `docs/BALANCE-NOTES.md`.
- Nessun bug legacy corretto d'iniziativa: si annota in `docs/KNOWN-ISSUES.md`.
- Testi di lore copiati carattere per carattere (accenti e apostrofi tipografici inclusi).

---

## Fase 0 — Analisi e documentazione *(questa fase)*

**Attività**: lettura integrale del legacy; `docs/ARCHITECTURE.md`; questo piano;
prima compilazione di `docs/BALANCE-NOTES.md` e `docs/KNOWN-ISSUES.md` con quanto
osservato durante la lettura. Nessun codice.

**Accettazione**: i documenti esistono e descrivono fedelmente il legacy; l'inventario
dei valori (§ Appendice A) è completo; ok esplicito del committente per la Fase 1.

## Fase 1 — Scaffolding

**Attività**: `package.json`, Vite, TypeScript `strict`, ESLint + Prettier, Vitest,
struttura cartelle di `docs/ARCHITECTURE.md`, `main.ts` che avvia una scena vuota con lo
sfondo `#0b0810` e la scritta di placeholder. Phaser da npm. `.gitignore`, `.editorconfig`.

**Accettazione**: `npm run dev` mostra il canvas 960×540 in Scale.FIT; lint/typecheck/test
(anche vuoto) passano; `npm run build` produce una build statica funzionante.
Il legacy resta apribile e giocabile com'era.

## Fase 2 — Estrazione dati e stringhe

**Attività**: `config/game.config.ts`, `config/balance.ts`, `data/classes.ts`,
`data/bosses.ts`, `data/relics.ts`, `data/lore.ts`, `data/strings.it.ts`, `data/i18n.ts`.
Solo dati e tipi, nessuna logica.

**Accettazione**: ogni valore dell'Appendice A è presente e identico al legacy (verifica
voce per voce, spuntando la tabella); ogni stringa visibile del legacy è in
`strings.it.ts`/`lore.ts` e un test confronta i testi di lore con le stringhe attese;
typecheck passa.

## Fase 3 — Art registry e generatori procedurali

**Attività**: `art/registry.ts` con le 20 texture legacy; un file per disegno in
`art/generated/` (stesso codice di disegno, stesse dimensioni di `ASSET_SIZE`, helper
`robedFigure` condiviso); risoluzione file-vince-su-generatore; `npm run art:preview`.

**Accettazione**: la pagina di preview mostra tutte le 20 texture con nome, dimensioni e
origine, visivamente identiche al legacy (confronto affiancato); mettendo un PNG di prova
in `assets/` con il nome di una chiave, la preview mostra il file al posto del generatore;
test di integrità del manifest verde.

## Fase 4 — Core

**Attività**: `core/StateMachine.ts`, `core/EventBus.ts`, `core/RunState.ts`,
`core/combat.ts`, `core/stamina.ts`, `input/InputManager.ts` + sorgenti tastiera/VPad +
`bindings.ts` (gamepad predisposto, completato in Fase 8), timer coyote/jump-buffer.

**Accettazione**: suite di test verde per: transizioni e eventi `at()`/`during()` della
StateMachine (incluse finestre i-frame 50–300ms del roll); stamina (costi 25/14/28,
regen 55/s, blocco azioni); danno (9 e 20 × mult × reliquia, smite 40, bolt 26);
coyote 90ms e jump buffer 130ms equivalenti a 30/60/144 fps; RunState (avanzamento boss,
reliquie, reset). Nessuna regressione nelle fasi precedenti.

## Fase 5 — Player in scena di prova

**Attività**: `entities/Player.ts` sulla StateMachine, arma e pose (`poseWeapon`),
particelle e slash fx, hazard `Bolt`, scena di prova (dev-only) con pavimento e bersaglio
fermo per verificare movimento, salto, roll, attacchi, cura, abilità delle tre classi.

**Accettazione**: confronto manuale col legacy, stessa "mano": velocità per classe
(265/215/325), salto −560 con taglio a −220, coyote e buffer percepibili, roll 380ms con
i-frame 50–300 e costo 25, attL/attH con le stesse finestre e gli stessi danni, heal +45,
cast/smite/presagio con gli stessi tempi ed effetti. Stamina bloccante identica.

## Fase 6 — I tre boss, uno alla volta

**Attività**: `BossBase` + interprete dei dati; poi in ordine Equus → Cornelia → Palladio,
ciascuno confrontato fianco a fianco col legacy (due finestre aperte) su: sequenze di
stati, telegrafi (glow, rotazioni, marchi a terra), probabilità di scelta, tempi, danni,
knockback, fase 2. Hazards `Flame`, `Spear`, `Wave`.

**Accettazione (per ciascun boss)**: tutti i valori della sua sezione in Appendice A
verificati; pattern indistinguibile dal legacy alla prova manuale; il boss muore, assegna
la reliquia e svanisce in 1500ms come oggi. Un quarto boss fittizio istanziabile da solo
file dati (smoke test dell'architettura, poi rimosso o lasciato dietro flag dev).

## Fase 7 — Tutte le scene e l'HUD

**Attività**: Title, Select, Lore, Fight completa, HudScene, Interlude, Victory; banner,
morte e retry; flusso completo con `RunState`.

**Accettazione**: **il gioco è completabile esattamente come il legacy**: titolo →
selezione (3 carte con statistiche e abilità) → 3 pagine di lore → 3 combattimenti con
interludi delle reliquie → vittoria → ritorno al titolo. Morte con testo per classe
(`SEI PERITA` / `SEI PERITO`) e retry funzionante. Tutti i testi identici. Touch
funzionante con il VPad legacy.

## Fase 8 — Aggiunte

**Attività**: SaveManager su localStorage (classe, boss raggiunto, reliquie, best time
per boss, reset esplicito); impostazioni (volume, shake on/off, rimappatura tasti);
pausa con ESC; supporto gamepad; debug overlay dev-only (FPS, hitbox/hurtbox, stati con
tempi, slider HP boss, salto a scena/boss).

**Accettazione**: salvataggio e ripristino verificati (refresh a metà run); reset
funziona; le impostazioni hanno effetto immediato e persistono; ESC mette in pausa e
riprende senza glitch di timing; il gioco è completabile con solo gamepad; l'overlay non
esiste nel bundle di produzione (verifica sul build output). Il game feel resta invariato
con le impostazioni di default.

## Fase 9 — CI, README, scaffolding, produzione

**Attività**: GitHub Actions (lint+typecheck+test+build su push); README con istruzioni;
script `npm run new:boss` / `new:class` / `new:scene` con template; build di produzione
con `base` relativo per GitHub Pages / itch.io.

**Accettazione**: CI verde sul repository; `new:boss -- prova` genera entità+dati+
registrazione+voce manifest+test e il progetto compila; la build statica gira aperta da
GitHub Pages (o da `npx serve dist`) e il gioco è completabile.

---

## Appendice A — Inventario di fedeltà (valori dal legacy)

Checklist da spuntare in Fase 2 e riverificare nelle Fasi 5–7. Riferimenti alle righe di
`legacy/ignis-vestae.html`.

### Mondo e configurazione (r. 35, 787, 988–995)
| Valore | Legacy |
|---|---|
| W × H, GROUND | 960 × 540, 460 |
| Gravità | y = 1500 |
| Bounds fisica Fight | x 30…W−30, y −400…GROUND+400 |
| Scale / pointers / bg | FIT + CENTER_BOTH, activePointers 4, `#0b0810` |

### Classi (r. 38–54)
| | VESTALE | SACERDOTE RINNEGATO | ARUSPICE |
|---|---|---|---|
| hp / st | 100 / 100 | 135 / 90 | 80 / 115 |
| mult / spd | 1 / 265 | 1.25 / 215 | 0.85 / 325 |
| ampolle / cd abilità | 4 / 8000 | 3 / 12000 | 4 / 14000 |
| abilità | FIAMMA VOTIVA | IRA SACRILEGA | PRESAGIO |
| morte | SEI  PERITA | SEI  PERITO | SEI  PERITO |
| colori robe/trim | 0xe9e2d0 / 0x8e2f2f | 0x5a5148 / 0xc9a227 | 0xd8dde5 / 0x4a6fa0 |

### Player (r. 255–397)
| Meccanica | Valori |
|---|---|
| Salto | −560; taglio a −220 se non tenuto; coyote 90ms; buffer 130ms |
| Corpo | box 30×60 offset (7,10); drag X 2400; accel 2800; maxVel.y 1000 |
| Roll | costo 25; vel 580 (maxVel 620); durata 380; i-frame 50–300; scala Y 0.62; solo a terra |
| Attacco leggero | costo 14; danno 9·mult; finestra 110–220; fine 340; box 78×70; fx a 110 |
| Attacco pesante | costo 28; danno 20·mult; finestra 300–450; fine 620; box 96×82; fx a 300 |
| Cura | +45 a t=550; fine 820; solo a terra, con ampolle e hp mancanti |
| Hurt | inv 900; stun 350; kb (x variabile, y −140); shake 140/0.008 |
| Stamina | regen 55/s solo in stato `free` |
| Fiamma a terra | danno 7; tick 750; raggio 28 orizzontale, y > GROUND−30 |
| FIAMMA VOTIVA | evento a 240, fine 480; dardo vx 560, danno 26·mult |
| IRA SACRILEGA | evento a 360, fine 700; danno 40·mult entro 135 dal boss; shake 200/0.014 |
| PRESAGIO | inv 2500; haste 2500 (spd ×1.45) |
| Reliquie attive | SUFFIMEN: +1 ampolla max; MOLA SALSA: mult ×1.4 |

### Equus October (r. 425–477) — hp 300, arena «Campo Marzio, la notte degli Equirria»
| Stato | Valori |
|---|---|
| Enrage | hp < 150 → sp 0.75 (windup e cooldown ×0.75) |
| Idle | insegue a 80/s; cooldown iniziale 1300 |
| Scelta | d>300 o rand<0.3 → carica; poi rand<0.5 → impennata; altrimenti soffio |
| Carica | windup 760·sp; corsa 900/s fino al muro (x<72 o >W−72); hitbox 120×84; danno 22 kb ±260; cool 1250·sp |
| Impennata | windup 560·sp (rotazione −0.35); cerchio r115 a (x+face·30, GROUND−10); danno 18 kb ±220; recupero 240; cool 1170·sp |
| Soffio | windup 630·sp; 4 fiamme a x+face·(50+i·66); recupero 380; cool 1400·sp |
| Hurtbox | 120×84 (x−60, GROUND−84) |

### Cornelia (r. 479–556) — hp 340, arena «Campus Sceleratus, la terra delle sepolte»
| Stato | Valori |
|---|---|
| Fase 2 | hp < 170 → sp 0.72 |
| Idle | insegue a 55/s; fluttuazione sin(t/260)·6 |
| Scelta | d<160 → rand<0.6 urlo, altrimenti grab; d≥160 → r<0.5 mani, r<0.8 teletrasporto, altrimenti grab |
| Mani | windup 800·sp; bersagli px e px±80·i (i=1; fase 2 i=1,2), clamp 50…W−50; cerchi r40 danno 15; recupero 430; cool 1000·sp |
| Grab | windup 500·sp; scatto 900/s per 220ms; rect 60×96 danno 19 kb ±240; fine windup+520; cool 1080·sp |
| Urlo | windup 600·sp; cerchio r150 a (x, GROUND−50) danno 22 kb ±320; recupero 340; cool 1330·sp |
| Teletrasporto | dissolvenza 330; riapparizione a px±110 (verso il centro), clamp 80…W−80; riapparso a 560 → concatena grab |
| Hurtbox | 52×96 (x−26, GROUND−96) |

### Il Palladio (r. 558–643) — hp 460, arena «Penus Vestae, la stanza segreta»
| Stato | Valori |
|---|---|
| Fase 2 | hp ≤ 230 → sp 0.68, tinta 0xd8b44f, stato `awaken` |
| Risveglio | esplosione a 430: cerchio r140 danno 12 kb ±300; fine 1000; cool 500 |
| Idle | insegue a 110/s se d>95 |
| Scelta | d>260 → (fase2 e rand<0.45 → slam) altrimenti lancia; fase2 e rand<0.25 → slam; altrimenti combo |
| Combo | 2 colpi (3 in fase 2); windup 270·sp, attivo 110, pausa 170·sp; avanza 330/s in attivo; rect 110×72 danno 13 kb ±220; cool 900·sp |
| Lancia | windup 470·sp; proiettile vx ±660 da (x+face·32, GROUND−36); danno 15 kb vx·0.45; recupero 320; cool 1000·sp |
| Slam | windup 330 (non scalato — vedi BALANCE-NOTES); volo 570ms verso px (clamp 80…W−80), arco sin·135; atterraggio: cerchio r90 danno 16, onde ±420 (danno 14 kb vx·0.5), shake 200/0.014; fine windup+960; cool 700 |
| Hurtbox | 48×104 (x−24, GROUND−104) |

### Hazards e scena Fight (r. 782–933)
| Elemento | Valori |
|---|---|
| Fiamma | vita 4000; danno 7 tick 750 |
| Lancia | rect 56×10; danno 15; kb vx·0.45; despawn x<10 / >W−10 |
| Onda | rect 24×36; danno 14; kb vx·0.5; despawn x<20 / >W−20 |
| Dardo player | danno 26·mult; despawn x<6 / >W−6 |
| dt clamp | min(dt, 50) |
| Boss morto | dissolvenza 1500; passa a Interlude dopo 1800 |
| HUD | hp 220×11, stamina 170×7, barra boss 560×9; ampolle, icona abilità con spicchio |

### Testi (r. 38–75, 698–706, 719–720, 769, 838, 846–849, 946–950, 974–979)
Prologo (3 pagine), reliquie (SUFFIMEN / MOLA SALSA / IL PALLADIO: titolo, descrizione,
effetto), nomi e sottotitoli boss, nomi arene, titolo e sottotitoli della Title, hint
comandi, testi Select, `RELIQUIA  RECUPERATA`, `CUSTODE  ANNIENTATO`, testi di morte,
`IGNIS  RENATUS` e la chiusa della vittoria, messaggi touch (`RUOTA IL TELEFONO`…):
copiati carattere per carattere, spaziature doppie incluse (es. `IGNIS  VESTAE`).
