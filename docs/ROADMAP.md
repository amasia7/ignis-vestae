# ROADMAP — rendere Ignis Vestae più entusiasmante

Piano d'azione ragionato, in ondate. Ogni ondata è giocabile e pubblicabile
da sola; dentro ogni ondata le voci sono in ordine di resa (impatto sul
divertimento diviso per fatica).

## Ondata 1 — Il colpo d'occhio (l'identità visiva e sonora)

L'infrastruttura c'è già (manifest asset + `assets/`): è l'ondata con il
miglior rapporto resa/sforzo.

1. **Sprite animati dei 3 personaggi** (idle 4f, corsa 6f, attacco 4f,
   roll 3f) via spritesheet — il manifest supporta già `frames`.
2. **Boss illustrati**: Equus, Cornelia e Palladio generati con l'AI a
   partire dai prompt in `docs/AI-ASSETS.md`.
3. **Musica**: `title.ogg` + una traccia per mondo + una per i boss
   (chiavi già riservate), con crossfade ai passaggi.
4. **Effetti sonori campionati** al posto dei beep (estensione del
   manifest agli sfx: colpo, roll, morte, urna, raccolta).
5. **Parallasse negli sfondi dei cammini** (2-3 piani) e nebbia bassa.

## Ondata 2 — La profondità del combattimento

1. **Armi con identità**, non solo moltiplicatore: velocità del colpo,
   portata, un tratto speciale ciascuna (la falx ignora parte della
   guardia, l'hasta colpisce più lontano, la dolabra spezza le urne da
   lontano…). I dati sono già in `data/weapons.ts`: si aggiungono campi.
2. **2-3 nemici nuovi per mondo** (già data-driven): un lanciatore a
   distanza, uno scudato che chiede il colpo pesante, uno esplosivo.
3. **Elite**: varianti rare dei nemici (più grandi, tinta diversa, drop
   garantito) piazzate dal generatore dei livelli.
4. **Mini-boss di metà mondo** al cammino III: un nemico elite con barra
   propria — spezza il ritmo dei 5 cammini.
5. **Contrattacco al roll perfetto**: schivare dentro la finestra i-frame
   negli ultimi 50ms apre 1s di danno maggiorato (ricompensa lo skill).

## Ondata 3 — Le ragioni per restare

1. **NG+**: dopo la vittoria si riparte col sigillo (già oggi armi e
   benedizioni sopravvivono): nemici +50% hp/danno, ricompense nuove.
2. **Sfide dei cammini**: obiettivi opzionali per livello (senza subire
   colpi, entro un tempo, senza ampolle) con sigilli cosmetici.
3. **Boss rush** dal menu LIVELLI: i tre custodi in fila, best time.
4. **Statistiche del sigillo**: morti, tempi, segreti trovati, % completamento.
5. **Quarto mondo** (l'architettura lo prevede: `new:boss` + un file
   dati): il Rex Sacrorum, sotto la Regia, con reliquia e arena proprie.

## Ondata 4 — L'apertura al mondo

1. **Pubblicazione su itch.io** (build già pronta) con pagina curata.
2. **Localizzazione inglese**: `strings.en.ts` — lo schema tipizzato
   garantisce che non manchi nulla; il selettore c'è già.
3. **Touch di seconda generazione**: pad virtuale rifinito, aptica, layout
   per tablet.
4. **Accessibilità**: modalità daltonismo per i telegrafi, rallentatore
   opzionale (-20% velocità globale), rimappatura completa già presente.
5. **Telemetria locale opzionale** (dove muoiono i giocatori, per
   bilanciare i cammini).

## Nord stelle (da tenere a mente a ogni ondata)

- Il game feel dei tre boss legacy è sacro: i test lo blindano.
- Tutto ciò che è contenuto (nemici, livelli, armi, buff, testi) resta
  **dati**, mai codice: è ciò che rende il gioco espandibile in un weekend.
- Ogni asset resta sostituibile via `assets/` senza toccare il codice.
