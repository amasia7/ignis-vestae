# Architettura tecnica (Godot 4)

## Scelte di fondo

- **Godot 4.3+**, **GDScript tipizzato** ovunque (`--warnings-as-errors`
  in CI quando arriva).
- Renderer **GL Compatibility** (serve l'export web).
- Risoluzione base 640×360, stretch `canvas_items`, filtro texture
  NEAREST (pixel-art), scala intera.
- **Tutto il contenuto è dato**: classi, nemici, abilità, oggetti,
  intenti, zone, chunk = **Resource `.tres`** con script `@export`. Il
  codice interpreta, non elenca. (È il DNA del progetto precedente,
  portato su Godot.)

## Layout della repo

```
/project.godot
/docs/                  ← questi documenti
/game/
  autoload/             ← singleton registrati in Project Settings
    event_bus.gd        ← segnali globali (combat_started, enemy_died…)
    run_state.gd        ← la run corrente: classe, PV, borsa, rotta, seme
    save_manager.gd     ← profilo, Cenere, sblocchi, impostazioni (3 slot)
    rng_service.gd      ← RandomNumberGenerator con seme della run
    music_manager.gd    ← tracce hub/esplorazione/arena, crossfade
  combat/               ← SOLO logica a turni, indipendente dalla grafica
    turn_engine.gd      ← round, ordine, risoluzione azioni
    combatant.gd        ← stato di un combattente (PV, stati, fila)
    intent.gd           ← un intento dichiarato
    actions/            ← una classe per azione (colpo, guardia, abilità…)
  map/
    zone_generator.gd   ← assembla i chunk col seme
    encounter.gd        ← entità-incontro sulla mappa (aggro, squadra)
  scenes/
    hub/                ← tempio.tscn + UI sblocchi
    overworld/          ← zona.tscn, player_overworld.tscn, POI
    combat/             ← arena.tscn, combatant_view.tscn, intent_ui.tscn
    ui/                 ← menu, borsa, schermata morte, impostazioni
  entities/             ← script di scena (view), MAI regole di gioco
/data/                  ← SOLO .tres (+ gli script Resource che li tipizzano)
  resources/            ← class_data.gd, enemy_data.gd, skill_data.gd…
  classes/    enemies/    skills/    items/    relics/
  intents/    squads/     zones/     chunks/   bosses/
  strings/    it.tres     ← bundle testi (mai stringhe nel codice)
/assets/
  sprites/    audio/    fonts/
/tests/                 ← gdUnit4 (unit sul combat engine e sul generatore)
/export/                ← (ignorata) build locali
```

## Le regole d'oro

1. **`combat/` non conosce le scene.** Il motore a turni è puro: riceve
   combattenti e azioni, emette eventi su `event_bus`. Le scene in
   `scenes/combat/` sono solo VISTA. Così il motore si testa headless
   con gdUnit4 senza aprire l'editor.
2. **Le Resource non hanno logica**, solo dati tipizzati + funzioni di
   lettura pure. Un nemico nuovo = `enemy_data.tres` + sprite + riga nel
   bundle testi. Zero script nuovi.
3. **Un segnale, non un riferimento.** Le scene comunicano via
   `event_bus`; nessuna scena cerca un'altra con `get_node("../..")`.
4. **Testi solo nel bundle** (`data/strings/it.tres`): l'inglese, un
   domani, è un file in più.
5. **Determinismo**: ogni casualità passa da `rng_service` (seme della
   run). Stesso seme → stessa run, stessi drop, stessi intenti.

## Flusso delle scene

```
Boot → Titolo → Tempio (hub)
                  │ parti
                  ▼
              Zona (overworld) ⇄ Arena (combat)   ← cambio scena con
                  │ santuario/bivio                 RunState che persiste
                  ▼                                 (è un autoload)
              Zona successiva → Arena del custode
                  ▼
              Vittoria / Morte → Tempio
```

## Salvataggio

- `user://profile.json`: Cenere, sblocchi, statistiche, impostazioni.
- `user://run.json`: la run in corso (per riprendere), col suo seme.
- 3 slot profilo come nel progetto precedente.
- Versionato con campo `version` e migrazioni esplicite.

## Pipeline asset (pixel-art)

- Stile: quello degli asset di riferimento — celle grosse, contorno
  scuro, oro/brace/rosso su notte. Palette condivisa in
  `assets/sprites/palette.png`.
- Dimensioni contrattuali per categoria (personaggi ~32×48 in overworld,
  ~64×96 in arena; tile 16×16). Un documento `assets/SPECS.md` le
  elenca quando si aprono i primi sprite.
- Gli sprite incollati in chat vanno caricati come PNG in
  `assets/sprites/` — in Godot non servono chiavi magiche: la `.tres`
  del nemico punta al file.
- Placeholder: rettangoli colorati generati, finché l'arte vera non
  arriva (mai bloccare il gameplay sull'arte).

## CI e distribuzione (da M1)

- GitHub Actions: `gdformat --check` + `gdlint` (gdtoolkit), poi test
  gdUnit4 headless, poi export web con Godot headless.
- Deploy dell'export web su **GitHub Pages** (stessa esperienza del
  progetto precedente: push → gioco pubblicato).

## Convenzioni

- File e cartelle `snake_case`; classi `PascalCase` con `class_name`.
- Un file = una responsabilità; scene piccole e componibili.
- Commit per unità logica, messaggi in italiano come finora.
- Niente addon finché non servono (gdUnit4 sarà il primo).
