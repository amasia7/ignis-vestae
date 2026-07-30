# IGNIS VESTAE

Roguelike a turni nella Roma antica notturna, costruito con **Godot 4**.

Il fuoco di Vesta si è spento. A ogni discesa il custode lascia il
Tempio, esplora le aree corrotte della Città — Campo Marzio, la Suburra,
la Necropoli — e affronta a turni bestie, creature, élite e custodi in
arena, per riportare la scintilla al focolare.

## Stato

**Pre-produzione**: design chiuso al primo giro, prototipo in arrivo
(milestone M0-M1). Niente di giocabile ancora.

## Documentazione

| Documento                                | Contenuto                                        |
| ---------------------------------------- | ------------------------------------------------ |
| [docs/GDD.md](docs/GDD.md)               | visione, pilastri, loop di gioco, decisioni aperte |
| [docs/COMBATTIMENTO.md](docs/COMBATTIMENTO.md) | il sistema a turni: round, intenti, PA, stati |
| [docs/CLASSI.md](docs/CLASSI.md)         | Vestale, Sacerdote Rinnegato, Aruspice           |
| [docs/BESTIARIO.md](docs/BESTIARIO.md)   | fauna, creature, élite, custodi                  |
| [docs/MAPPA.md](docs/MAPPA.md)           | hub, zone, generazione, esplorazione             |
| [docs/ARCHITETTURA.md](docs/ARCHITETTURA.md) | struttura Godot, dati come Resource, convenzioni |
| [docs/ROADMAP.md](docs/ROADMAP.md)       | milestone M0 → M5                                |

## Aprire il progetto

1. Installa [Godot 4.3+](https://godotengine.org/download) (versione
   standard, non .NET).
2. Apri l'editor → *Importa* → seleziona questa cartella.

## Storia del progetto

Questa repo ha ospitato due incarnazioni precedenti del gioco (prototipo
HTML single-file, poi action 2D in Phaser). Sono state archiviate nella
storia git — ultimo commit del gioco Phaser: `b5426da`. La cartella
`legacy/` conserva il prototipo originale.
