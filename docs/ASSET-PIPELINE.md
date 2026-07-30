# Pipeline degli asset via GitHub

Gli artwork si sostituiscono **uno alla volta, senza toccare il codice**:
ogni texture ha una chiave nel manifest (`src/art/registry.ts`) e, finché non
esiste un file reale, viene disegnata dal generatore procedurale.

## Il flusso per aggiungere/sostituire un artwork

1. **Trova la chiave e le dimensioni.** `npm run art:preview` mostra tutte le
   texture con chiave, dimensioni e provenienza (`GEN` = procedurale,
   `FILE` = file reale). Es.: `pl0 — 44x70` è la Vestale, `equus — 190x120`
   il primo boss.
2. **Crea il PNG** con le stesse dimensioni della chiave (sfondo
   trasparente). Per uno **spritesheet** animato: strisce orizzontali, cioè
   larghezza = N × larghezza dichiarata (es. `pl0` con 6 frame = 264×70), e
   dichiara `frames: { count: 6, rate: 10 }` nella voce del manifest.
3. **Mettilo in `assets/<chiave>.png`** (es. `assets/pl0.png`).
4. **Verifica in locale**: `npm run assets:check` conferma nome e dimensioni;
   `npm run art:preview` lo mostra marcato `FILE`; `npm run dev` lo usa in gioco.
5. **Apri una PR su GitHub** (o pusha su un branch): la CI esegue
   `assets:check` insieme a lint/test/build — un asset con chiave inesistente
   o dimensioni sbagliate fa fallire il check con un messaggio esplicito.
6. **Merge** → il workflow di deploy pubblica il gioco aggiornato su Pages.

Anche da browser, senza clonare nulla: su GitHub → `assets/` →
_Add file → Upload files_ → scegli il PNG → _Propose changes_ → la CI valida
→ merge. È il percorso pensato per lavorare sugli artwork in modo
indipendente dal codice.

## Regole

- Il nome del file **è** la chiave: `assets/equus.png` sostituisce la
  texture `equus`, tutto il resto resta procedurale.
- Le dimensioni dichiarate nel manifest sono contrattuali: cambiare taglia a
  uno sprite significa cambiare hitbox percepite — se serve, si aggiorna
  prima il manifest nel codice (PR separata).
- Per tornare al placeholder procedurale basta eliminare il file.

## Chiavi principali

| Chiave                            | Contenuto                         | Dimensioni              |
| --------------------------------- | --------------------------------- | ----------------------- |
| `pl0` `pl1` `pl2`                 | Vestale, Sacerdote, Aruspice      | 44×70                   |
| `wp0` `wp1` `wp2` `wp3`           | secespita, spatha, lituus, gladio | vedi preview            |
| `equus` `ghost` `statue`          | i tre boss                        | 190×120, 64×112, 64×120 |
| `shade` `larva`                   | mini-nemici dei livelli           | 40×64, 36×22            |
| `hand` `spear` `warn` `flameglow` | telegrafi e proiettili            | vedi preview            |
| `brazier` `balsamo`               | oggetti di scena e pickup         | 72×40, 20×20            |

L'elenco completo e aggiornato è sempre `npm run art:preview`.

## Musica

Stessa logica: `assets/audio/title.ogg` (o `.mp3`) sostituisce la musica
procedurale del menu. Chiavi e specifiche complete — incluse quelle per
generare gli asset con un'altra AI — in `docs/AI-ASSETS.md`.
