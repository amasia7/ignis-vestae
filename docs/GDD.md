# IGNIS VESTAE — Game Design Document

> Documento madre. I sistemi sono approfonditi nei documenti dedicati:
> [COMBATTIMENTO](COMBATTIMENTO.md) · [CLASSI](CLASSI.md) ·
> [BESTIARIO](BESTIARIO.md) · [MAPPA](MAPPA.md) ·
> [ARCHITETTURA](ARCHITETTURA.md) · [ROADMAP](ROADMAP.md)

## In una frase

**Roguelike a turni nella Roma antica notturna**: a ogni discesa il
custode parte dal Tempio di Vesta, esplora le aree corrotte della Città e
affronta scontri a turni — bestie, creature, élite e custodi in arene —
per riportare la scintilla al focolare.

## Motore e piattaforma

- **Godot 4.3+**, GDScript tipizzato, renderer GL Compatibility.
- Risoluzione base **640×360** (pixel-art, scala intera), export desktop e
  **web** (GitHub Pages, come il progetto precedente).
- Lingua dei contenuti: italiano (bundle testi separato dal codice).

## I quattro pilastri

1. **Roma notturna e rituale.** Identità visiva costruita ATTORNO agli
   asset pixel-art di riferimento (guerriero con scudo e sciarpa rossa,
   arciere scheletrico, segugio infernale, aquila legionaria, spada
   fiammeggiante): celle grosse, contorni scuri, oro e brace su fondi
   notturni. Niente realismo: icone.
2. **Turni leggibili.** Ogni nemico dichiara il proprio intento prima di
   agire; vincere è leggere il round e rispondere bene, mai avere
   riflessi. Zero informazione nascosta sulle meccaniche.
3. **Run brevi e dense.** 20–40 minuti a discesa, morte sempre
   istruttiva, meta-progressione sobria che allarga le OPZIONI (non i
   numeri) tra una run e l'altra.
4. **Tutto è dato.** Classi, nemici, abilità, oggetti, zone, boss: tutto
   vive in Resource (`.tres`) e file dati, mai nel codice. Aggiungere un
   nemico non richiede di toccare uno script.

## Loop di gioco

### Macro (la run)

```
TEMPIO DI VESTA (hub)
   │  scegli classe, spendi Cenere negli sblocchi, parti
   ▼
ZONA 1 ── esplori · combatti · eventi · segreti ── santuario
   ▼  (bivio: scegli la prossima area tra due)
ZONA 2 ── come sopra, più dura ── santuario
   ▼
ARENA DEL CUSTODE (boss)
   ▼
vittoria: la scintilla torna al Tempio  ·  morte: torni al Tempio
   │
   └── in entrambi i casi porti a casa CENERE VOTIVA → sblocchi → nuova run
```

- La prima versione copre **una discesa corta**: 2 zone + 1 custode
  (stesso principio «si parte piccoli» del progetto precedente).
- Le run successive si allungano aggiungendo zone e custodi, non
  gonfiando i numeri.

### Micro (lo scontro)

Incontro sulla mappa → transizione all'**arena a turni** → round di
scelte contro intenti dichiarati → vittoria (bottino, esperienza di run)
o sconfitta (fine della run). Dettagli in [COMBATTIMENTO](COMBATTIMENTO.md).

## Struttura roguelike

- **Permadeath**: la morte chiude la run. Si conservano solo Cenere
  Votiva e sblocchi.
- **Generazione**: le zone sono assemblate da stanze prefabbricate
  (chunk disegnati a mano, ordine e collegamenti procedurali con seme).
  Determinismo a parità di seme, per test e daily-run future.
- **Scelte di rotta**: tra una zona e l'altra un bivio (2 opzioni con
  rischio/ricompensa dichiarati: «più élite, più urne»).
- **Meta-progressione** (al Tempio, valuta: **Cenere Votiva**):
  - sbloccare nuove abilità nel pool della classe (si PESCANO in run,
    non si portano da casa);
  - sbloccare oggetti nel pool dei santuari;
  - «Editti»: modificatori di difficoltà opzionali che aumentano la
    Cenere guadagnata.

## Le tre classi (sintesi)

Un solo personaggio per run, scelto al Tempio. Identità ereditate dal
progetto precedente, ripensate per i turni — schede complete in
[CLASSI](CLASSI.md):

| Classe                  | Ruolo                | Tratto distintivo                          |
| ----------------------- | -------------------- | ------------------------------------------ |
| **Vestale**             | equilibrata, fuoco   | Bruciature e cure: controlla la durata     |
| **Sacerdote Rinnegato** | tank, scudo          | Guardia attiva: para e risponde            |
| **Aruspice**            | rapida, presagi      | Manipola iniziativa e intenti dei nemici   |

## I nemici (sintesi)

Quattro fasce, schede in [BESTIARIO](BESTIARIO.md):

1. **Fauna** (lupi, cinghiali, aspidi…): scontri semplici, insegnano il
   sistema.
2. **Creature della corruzione** (guerrieri rinnegati, arcieri
   scheletrici, ombre…): intenti articolati, sinergie di gruppo.
3. **Élite** (segugio infernale…): incontri singoli segnalati sulla
   mappa, modificatori e bottino garantito.
4. **Custodi** (boss in arena): multi-fase, pattern a round. Equus
   October, Cornelia e il Palladio tornano come custodi delle zone.

## Cosa NON è questo gioco

- Non è un action: nessun input in tempo reale in combattimento.
- Non è un dungeon crawler infinito: run corte e finite.
- Non è un gioco di build infinite: pochi oggetti, molto caratterizzati.
- La storia esiste ma è rimandata: per ora SOLO cornice (il fuoco
  spento, il Tempio, la Città corrotta).

## Decisioni aperte

| # | Decisione | Raccomandazione |
| - | --------- | --------------- |
| 1 | Esplorazione: zone top-down esplorabili vs mappa a nodi pura (à la Slay the Spire) | **Zone top-down**: valorizzano gli asset e l'ambientazione; i nodi restano per la scelta di rotta TRA zone |
| 2 | Solo protagonista vs party | **Singolo** con alleati temporanei (evocazioni, spiriti) — un party completo cambierebbe scala del progetto |
| 3 | Incontri: visibili sulla mappa vs casuali | **Visibili**: coerente col pilastro «zero informazione nascosta» |
| 4 | Griglia di combattimento: file (mischia/retrovia) vs posizione libera | **Due file per lato**: dà senso ad arcieri e portata, resta leggibile |
