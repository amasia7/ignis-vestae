# Roadmap

Milestone GIOCABILI: ognuna chiude qualcosa che si può provare con mano.
Ordine pensato per validare presto i rischi grossi (il combat a turni
prima di tutto). La storia resta fuori finché il gioco non gira.

## M0 — Fondamenta (repo che si apre e si testa)

- [x] Repo ripulita dal progetto Phaser (storia in `b5426da`)
- [x] `project.godot` (640×360, pixel-art, GL Compatibility)
- [x] Documentazione di design (questa cartella)
- [ ] Autoload: `event_bus`, `run_state`, `rng_service` (scheletri)
- [ ] Script Resource: `class_data`, `enemy_data`, `skill_data`,
      `intent_data` + le prime `.tres` (Vestale, Lupo, Cinghiale)
- [ ] gdUnit4 + primo test headless (l'ordine del round)
- [ ] CI: gdformat + gdlint + test

## M1 — Il prototipo che decide tutto (SOLO combat)

Un'arena hard-coded: Vestale contro 2 lupi e un cinghiale.

- [ ] `turn_engine`: round, iniziativa, PA, risoluzione azioni
- [ ] Intenti dichiarati con icona e valore, ordine del round visibile
- [ ] Azioni base: Colpo, Guardia, Oggetto, Fuga + Fiamma Votiva/Focolare
- [ ] Ardore, Bruciatura, Vulnerabile, Stordimento
- [ ] Due file per lato, cambio fila, portata delle armi
- [ ] Vittoria/sconfitta, placeholder art (rettangoli va benissimo)
- **Uscita di milestone**: lo scontro DIVERTE già così? Si tara qui,
  non dopo.

## M2 — Una zona vera

- [ ] Overworld top-down: movimento, camera, collisioni
- [ ] `zone_generator`: chunk prefabbricati + collegamento con seme
- [ ] Incontri visibili con aggro leggibile → transizione all'arena
- [ ] Braciere, urne segrete, un evento, il santuario d'uscita
- [ ] Campo Marzio completo con le sue squadre (fauna + primi guerrieri)

## M3 — La prima discesa completa

- [ ] Tempio di Vesta (hub): scelta classe, partenza
- [ ] Rotta: Campo Marzio → bivio (Suburra/Cloaca, una delle due basta)
      → arena di EQUUS OCTOBER
- [ ] Boss: mazzo intenti multi-round, meccanica d'arena, bottino
- [ ] Morte → Tempio con Cenere; vittoria → chiusura della run
- [ ] Salvataggio profilo + run in corso
- **Uscita**: la run di 20–30 minuti esiste, si muore e si riparte.

## M4 — Le tre classi e il bestiario

- [ ] Sacerdote e Aruspice giocabili (kit completi di partenza)
- [ ] Pool abilità + pesca al santuario (3 scelte)
- [ ] Fascia 2 completa (arciere, ombra, larva) + élite Segugio
- [ ] Reliquie, armi trovabili, negozio del santuario
- [ ] Meta-progressione: bracieri degli sblocchi, primi Editti

## M5 — Rifinitura e pubblicazione

- [ ] Sprite definitivi sugli asset di riferimento (via `assets/`)
- [ ] Musica hub/esplorazione/arena, sound design dei turni
- [ ] Juice dei turni: anticipazioni, screen shake misurato, hit-stop
- [ ] Export web + deploy automatico su GitHub Pages
- [ ] Bilanciamento su dati (seed fissi + statistiche di morte)

## Poi (non ora)

Seconda e terza zona con Cornelia e il Palladio · eventi con catene ·
daily run col seme del giorno · la storia · localizzazione inglese.
