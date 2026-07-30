# Sistema di combattimento a turni

> I numeri qui dentro sono la PRIMA PROPOSTA di tuning: si fissano solo
> dopo il prototipo (M1 della [ROADMAP](ROADMAP.md)). La struttura invece
> è il contratto su cui si costruisce il codice.

## Il campo

- Arena dedicata (transizione dalla mappa), sfondo dell'area corrente.
- **Due file per lato**: mischia (davanti) e retrovia (dietro).
  - Il protagonista può cambiare fila una volta per turno (gratis).
  - Le armi corte colpiscono solo la mischia avversaria; archi, dardi e
    abilità dichiarano la portata sulla carta.
  - Se la mischia avversaria è vuota, la retrovia è esposta.
- Da 1 a 4 nemici per scontro.

## Il round

1. **Dichiarazione degli intenti**: ogni nemico mostra sopra la testa
   cosa farà (icona + valore: «⚔ 8», «🏹 5 ×2», «⛨ si prepara»,
   «☠ evoca»). Pilastro: zero informazione nascosta.
2. **Ordine di azione** per Celeritas decrescente (pari merito: il
   protagonista prima). L'ordine del round è sempre visibile in alto.
3. Ognuno agisce nel proprio turno; gli effetti di stato maturano alla
   FINE del turno del proprietario.
4. Fine round → nuova dichiarazione di intenti.

## Il turno del protagonista: Punti Azione

**3 PA** per turno. Le azioni base:

| Azione        | PA  | Effetto                                                        |
| ------------- | --- | -------------------------------------------------------------- |
| **Colpo**     | 2   | danno d'arma alla mischia (o secondo portata dell'arma)        |
| **Affondo**   | 3   | danno d'arma ×1.6, ma il prossimo round parti Vulnerabile      |
| **Abilità**   | 1–3 | secondo la scheda; molte costano anche Ardore                  |
| **Oggetto**   | 1   | dalla borsa (cure, incensi, dardi…)                            |
| **Guardia**   | 1   | −50% danno fino al prossimo turno; a fine round rigenera Ardore |
| **Cambio fila** | 0 | una volta per turno                                            |
| **Fuga**      | 3   | solo fauna e creature comuni; % su Celeritas; fallita = round perso |

I PA non spesi NON si accumulano (il turno è una frase compiuta).

## Le risorse

- **PV** — punti vita. A zero, fine della run.
- **Ardore** — carburante delle abilità (max 10). Si genera: +2 quando
  colpisci, +2 quando subisci danno, +3 in Guardia a fine round. Parte a
  0 in ogni scontro: le abilità grosse vanno COSTRUITE nel combattimento.
- **PA** — i 3 punti del turno (vedi sopra).

## Le statistiche

| Stat          | Governa                                              |
| ------------- | ---------------------------------------------------- |
| **Vis**       | danno delle armi e delle abilità fisiche             |
| **Pietas**    | danno/efficacia delle abilità sacre e delle cure     |
| **Celeritas** | ordine del round, % di schivata, riuscita della fuga |
| **Tempra**    | riduzione piatta del danno subìto                    |

Formula danno (proposta): `danno = (base arma o abilità + stat di
riferimento) × moltiplicatori − Tempra del bersaglio`, minimo 1.
La schivata è un tiro percentuale SOLO contro attacchi che la scheda
dichiara «schivabili» — i colpi ad area non lo sono mai.

## Stati (pochi e forti)

| Stato            | Effetto                                                     |
| ---------------- | ----------------------------------------------------------- |
| **Bruciatura**   | danno a fine turno per N turni (firma della Vestale)        |
| **Sanguinamento**| come sopra, fisico; si cumula in intensità                  |
| **Stordimento**  | salta il prossimo turno (MAI due volte di fila sullo stesso bersaglio) |
| **Vulnerabile**  | +50% danno subìto per 1 round                                |
| **Guardia**      | −50% danno fino al prossimo turno del proprietario           |
| **Benedizione**  | +30% al prossimo colpo/abilità                               |
| **Presagio**     | (solo Aruspice) vedi l'intento COMPLETO e puoi ritardarlo    |

## La grammatica degli intenti

Erede dei «telegrafi colorati» del progetto precedente: ogni intento
nemico appartiene a una famiglia che chiede una risposta diversa —

| Famiglia         | Icona | Risposta giusta                                    |
| ---------------- | ----- | -------------------------------------------------- |
| **Colpo diretto**| ⚔     | Guardia, o uccidi prima l'attaccante               |
| **Tiro**         | 🏹    | elimina/raggiungi la retrovia, o Guardia           |
| **Carica**       | 🐗    | cambia fila (la carica colpisce SOLO la mischia)   |
| **Preparazione** | ⛨/✦   | interrompi (stordimento) o preparati al peggio     |
| **Evocazione**   | ☠     | interrompi, o accetta un nemico in più             |
| **Inevitabile**  | 💀    | non si evita: mitiga (Guardia, Tempra) e incassa   |

## Tipologie di incontro

1. **Fauna** (1–3 bestie): intenti semplici, quasi tutto schivabile.
   Servono a imparare; danno poca Cenere.
2. **Creature** (2–4): sinergie vere (il guerriero protegge l'arciere,
   l'ombra evoca larve). Il cuore del gioco.
3. **Élite** (1, segnalato sulla mappa): statistiche maggiorate + UNA
   regola speciale dichiarata a inizio scontro («il Segugio agisce due
   volte»). Bottino garantito. Si può sempre scegliere di NON ingaggiarli.
4. **Custode** (arena): multi-fase; a soglie di PV cambia il mazzo di
   intenti e l'arena stessa reagisce (bracieri che si accendono, file
   che crollano). Il primo custode NON ha fase 2 (regola ereditata: la
   difficoltà extra arriva dai custodi successivi).

## Fine dello scontro

- **Vittoria**: Cenere Votiva, eventuale drop (raro, ≤10%: regola
  ereditata), PV NON ripristinati — la gestione tra scontri è parte del
  gioco; si cura al santuario o con oggetti.
- **Sconfitta**: fine della run, ritorno al Tempio con la Cenere
  raccolta. Schermata di morte con il riepilogo della discesa.
