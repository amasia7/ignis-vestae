# Mappa, zone ed esplorazione

## Il modello

Esplorazione **top-down a zone** (vista dall'alto leggermente inclinata,
pixel-art): il protagonista si muove liberamente dentro una zona; gli
incontri sono ENTITÀ VISIBILI sulla mappa (un branco di lupi che
pattuglia, un guerriero di guardia a un'urna) — toccarli, o farsi
raggiungere, apre l'arena a turni. Tra una zona e l'altra, un bivio di
rotta con rischio/ricompensa dichiarati.

## Il Tempio di Vesta (hub, fuori dalla run)

- Scelta della classe e partenza della discesa.
- **Bracieri degli sblocchi**: si spende la Cenere Votiva (abilità nei
  pool, oggetti nei santuari, Editti).
- Il focolare centrale mostra i progressi (custodi battuti, statistiche).
- Niente combattimenti, niente tempo: è casa.

## Le zone della Città

Ogni zona ha identità visiva, fauna/creature proprie e UNA meccanica
d'ambiente. Prima discesa (M3): Campo Marzio → bivio → arena di Equus.

| Zona                       | Ambiente e meccanica                                             | Abitanti tipici                       | Custode        |
| -------------------------- | ---------------------------------------------------------------- | ------------------------------------- | -------------- |
| **Campo Marzio**           | prati e insegne cadute; le AQUILE legionarie sono i checkpoint    | fauna, primi guerrieri                | Equus October  |
| **Suburra**                | vicoli stretti: le rotte interne sono strozzature con imboscate   | guerrieri, aspidi, Veterano (élite)   | —              |
| **Foro / Regia**           | marmi e bracieri spenti: accenderli apre scorciatoie              | creature miste, Aruspice corrotto     | Il Palladio    |
| **Cloaca Maxima**          | buio: vedi solo un intorno; le torce sono risorsa                 | larve, ombre, aspidi                  | —              |
| **Necropoli dell'Appia**   | nebbia bassa; le urne segrete sono qui più ricche e più sorvegliate | ombre, arcieri, Segugio (élite)     | Cornelia       |

## Anatomia di una zona

Assemblata da **stanze prefabbricate** (chunk disegnati a mano, ~10–15
per zona) collegate proceduralmente con seme deterministico:

- 3–4 **combattimenti** di fascia 1–2 (visibili, in parte evitabili con
  movimento accorto — evitarli = meno Cenere);
- 1 **élite opzionale**, segnalato, a guardia di un bottino vero;
- 1–2 **eventi** (scelte testuali brevi con esito meccanico);
- **urne segrete** fuori rotta (1–2: un'arma o una reliquia);
- 1 **braciere** (checkpoint di zona: cura parziale, +PV massimi UNA
  volta);
- il **santuario** d'uscita: cura, negozio (Cenere della run), pesca di
  un'abilità (3 scelte, ne tieni 1), poi il bivio per la zona successiva.

Densità pensata per 7–10 minuti a zona.

## Il bivio di rotta

All'uscita di ogni zona due destinazioni possibili, con etichette oneste:

> ◆ SUBURRA — «vicoli infidi: +1 élite, +1 urna»
> ◆ CLOACA — «il buio chiede torce: eventi rari, mercante raro»

La rotta si chiude sempre sull'arena del custode della discesa.

## Regole di generazione

- Seme per run: stessa run riproducibile (test, e in futuro daily run).
- I chunk dichiarano i propri attacchi (porte N/S/E/O); il generatore
  garantisce: rotta principale sempre percorribile, segreti mai sulla
  rotta obbligata, braciere sempre prima dell'élite.
- La difficoltà scala per POSIZIONE nella rotta (zona 2 pesca squadre
  più cattive dallo stesso bestiario), mai gonfiando i PV a runtime.

## Su schermo (esplorazione)

- Minimappa a scoperta progressiva (stanze visitate).
- I nemici hanno cono/raggio di attenzione visibile: l'aggro è leggibile
  come gli intenti in arena.
- Interazioni a un tasto: urne, bracieri, eventi, santuari.
- Nessun combattimento in tempo reale: il contatto APRE l'arena.
