# Generare gli asset con un'altra AI (senza toccare il codice)

Questa guida è pensata per lavorare **in modo del tutto indipendente dal
codice**: generi un file con l'AI che preferisci (Midjourney, DALL·E, Stable
Diffusion, Suno, ElevenLabs…), lo carichi su GitHub nella cartella giusta con
il nome giusto, la CI lo valida, il merge lo pubblica. Fine.

## Il principio

Ogni asset ha una **chiave**. Il gioco cerca prima un file con quel nome; se
non lo trova usa il disegno/suono procedurale integrato. Quindi:

- immagini → `assets/<chiave>.png`
- musica → `assets/audio/<chiave>.ogg` (o `.mp3`)

Il caricamento si può fare interamente dal browser: GitHub → cartella
`assets/` → _Add file → Upload files_ → _Propose changes_ → la CI controlla
nome e dimensioni → merge → il deploy pubblica.

Per vedere ogni chiave e il placeholder attuale: `npm run art:preview`
(oppure guarda la tabella sotto).

## Immagini (PNG, sfondo trasparente)

Le dimensioni sono **contrattuali**: il PNG deve avere esattamente
l'altezza dichiarata e larghezza uguale (immagine statica) o multipla
(spritesheet a strisce orizzontali). `npm run assets:check` te lo conferma
in locale; la CI lo impone sulle PR.

### Personaggi giocabili (44×70, piedi appoggiati al bordo inferiore)

| Chiave | Chi è                                                              |
| ------ | ------------------------------------------------------------------ |
| `pl0`  | Vestale — veste avorio, fasce rosse, velo                          |
| `pl1`  | Sacerdote Rinnegato — veste grigio-terra, fasce dorate, spallaccio |
| `pl2`  | Aruspice — veste chiara azzurrina, fasce blu                       |

Prompt d'esempio per un'AI di immagini:

> _pixel-art / flat vector side-view sprite, 44x70, ancient Roman vestal
> priestess in ivory robe with red sashes and veil, facing right, feet at
> the bottom edge, transparent background, dark souls-like mood, muted
> palette (#e9e2d0, #8e2f2f, gold accents), no outline glow_

Per **animarli**: spritesheet orizzontale, es. 6 frame → 264×70, e nella
voce del manifest (`src/art/registry.ts`) si aggiunge
`frames: { count: 6, rate: 10 }` (unico caso in cui serve una riga di
codice — chiedila pure a Claude o falla a mano: è una PR di una riga).

### Armi (impugnatura a sinistra, lama verso destra)

| Chiave | Arma                             | Dimensioni |
| ------ | -------------------------------- | ---------- |
| `wp0`  | secespita (coltello sacrificale) | 34×10      |
| `wp1`  | spatha (lama lunga)              | 44×12      |
| `wp2`  | lituus (bastone ricurvo)         | 34×36      |
| `wp3`  | gladio consacrato                | 44×12      |
| `wp4`  | falx votiva (falce)              | 44×14      |
| `wp5`  | dolabra (piccone-scure)          | 44×16      |
| `wp6`  | hasta pura (asta)                | 52×10      |

> _side-view weapon sprite, ancient roman gladius, hilt on the LEFT, blade
> pointing RIGHT, 44x12 px, transparent background, muted gold and bone
> tones, flat shading_

### Boss e nemici (a terra sul bordo inferiore, rivolti a destra)

| Chiave   | Chi è                                      | Dimensioni |
| -------- | ------------------------------------------ | ---------- |
| `equus`  | Equus October, cavallo spettrale in fiamme | 190×120    |
| `ghost`  | Cornelia, la Sepolta Viva                  | 64×112     |
| `statue` | Il Palladio, statua-custode con scudo      | 64×120     |
| `shade`  | ombra minore (nemico dei cammini)          | 40×64      |
| `larva`  | larva di brace (nemico dei cammini)        | 36×22      |

Nota per il boss: il gioco lo specchia via `scaleX` — disegnalo **rivolto a
destra**. Il Palladio in fase 2 viene tinto d'oro dal gioco: usa una base
quasi bianca/neutra.

### Oggetti, telegrafi, scena

| Chiave                      | Cosa                                                             | Dimensioni   |
| --------------------------- | ---------------------------------------------------------------- | ------------ |
| `balsamo`                   | ampollina curativa                                               | 20×20        |
| `sigil`                     | sigillo delle benedizioni (il gioco lo tinge) — disegnalo BIANCO | 22×22        |
| `urn`                       | urna dei segreti                                                 | 30×38        |
| `brazier`                   | braciere                                                         | 72×40        |
| `spear`                     | lancia scagliata (punta a destra)                                | 66×12        |
| `hand`                      | mano che erompe dal suolo                                        | 28×48        |
| `warn`                      | marchio a terra (ellisse)                                        | 76×18        |
| `flameglow`                 | bagliore della fiamma a terra                                    | 60×18        |
| `slash` `bolt` `dot` `ring` | effetti                                                          | vedi preview |
| `btn` `btnsm`               | tasti del pad touch                                              | 62×62, 50×50 |

## Musica e audio

- Formato: **OGG** (preferito) o MP3, in `assets/audio/<chiave>.ogg`.
- La traccia deve **loopare pulita** (niente coda di riverbero al taglio).
- Volume master consigliato: circa −16 LUFS; il gioco la scala col volume
  delle impostazioni.

| Chiave                     | Dove suona            | Stato                                        |
| -------------------------- | --------------------- | -------------------------------------------- |
| `title`                    | menu principale       | attiva (sostituisce la salmodia procedurale) |
| `world1` `world2` `world3` | cammini dei tre mondi | riservata (si attiva su richiesta)           |
| `boss1` `boss2` `boss3`    | scontri coi custodi   | riservata                                    |

Prompt d'esempio per un'AI musicale:

> _dark ambient ancient Roman ritual chant, low male drone in D minor,
> sparse female vocalise, distant bronze bell, slow tempo 50 bpm, somber
> sacred atmosphere, seamless loop, no percussion, 90 seconds_

Gli **effetti sonori** oggi sono beep sintetici coerenti; se vorrai
sostituirli con file servirà una piccola estensione del codice (stessa
logica del manifest) — è nella ROADMAP.

## Regole d'oro

1. Il nome del file è la chiave: `assets/equus.png`, non `assets/cavallo.png`.
2. Non cambiare le dimensioni di tua iniziativa: cambiano le proporzioni
   percepite delle hitbox. Se un artwork ti serve più grande, prima si
   aggiorna il manifest (PR di codice), poi il file.
3. Un asset per PR è l'ideale: la preview di `art:preview` e la CI ti dicono
   subito se è a posto, e il rollback è banale (cancelli il file).
4. Stile di riferimento: notturno, terroso, oro/brace su fondi scuri
   (#c9a227, #ff9a3c, #8e2f2f su #070509) — guarda gli attuali placeholder
   per capire l'ingombro e la silhouette che il gioco si aspetta.
