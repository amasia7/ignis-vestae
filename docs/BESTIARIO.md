# Bestiario

> Ogni nemico è una Resource (`.tres`) con: statistiche, file preferita,
> mazzo di intenti (con pesi e condizioni), bottino. Le schede sotto sono
> il contenuto di partenza; i numeri si fissano al prototipo.
> Gli asset pixel-art di riferimento del committente sono i capostipiti
> dello stile: guerriero, arciere scheletrico, segugio infernale.

## Fascia 1 — Fauna (gli scontri che insegnano)

| Nemico       | PV | File     | Intenti principali                                   |
| ------------ | -- | -------- | ---------------------------------------------------- |
| **Lupo**     | 18 | mischia  | ⚔ morso 5 · 🐗 balzo 7 (solo se in branco)           |
| **Cinghiale**| 30 | mischia  | 🐗 carica 9 (ogni 2 round, telegrafata) · ⚔ zanne 4  |
| **Aspide**   | 12 | mischia  | ⚔ morso 3 + Sanguinamento · ⛨ si acquatta (schiva+)  |
| **Corvi**    | 10 | retrovia | 🏹 beccata 2 ×3 · ☠ stormo (evoca 1 corvo)           |

Branco tipico: 2 lupi · cinghiale + aspide · 3 corvi. Quasi tutto
schivabile, poca Cenere, mai reliquie.

## Fascia 2 — Creature della corruzione (il cuore del gioco)

| Nemico                  | PV | File     | Identità                                                         |
| ----------------------- | -- | -------- | ---------------------------------------------------------------- |
| **Guerriero rinnegato** | 45 | mischia  | ⚔ gladio 8 · ⛨ muro di scudi (protegge la retrovia: i tiri contro di essa sono bloccati finché è vivo e in guardia) |
| **Arciere scheletrico** | 25 | retrovia | 🏹 freccia di brace 6 + Bruciatura 1 · ⛨ mira (il prossimo tiro non è schivabile) |
| **Ombra sepolta**       | 35 | qualsiasi| ⚔ artiglio 6 · ☠ lamento (evoca 1 larva, max 2) · immune al Sanguinamento |
| **Larva di brace**      | 8  | mischia  | ⚔ morso 3 · 💀 scoppio (muore: 5 a tutta la mischia) — va uccisa a distanza |

Le squadre sono COSTRUITE per sinergia, non casuali: guerriero+arciere
(lo scudo copre il tiro), ombra+larve (rinforzi), doppio arciere+aspide.

## Fascia 3 — Élite (l'incontro che si sceglie)

Segnalati sulla mappa con nome e regola speciale VISIBILE prima di
ingaggiare. Statistiche ×2 circa, bottino garantito (arma o reliquia).

| Élite                    | Regola speciale dichiarata                          |
| ------------------------ | ---------------------------------------------------- |
| **Segugio infernale**    | agisce DUE volte per round; le crepe di brace: +1 Bruciatura a chi lo colpisce in mischia |
| **Veterano della Suburra** | inizia con 3 round di muro di scudi; la sua ⚔ ignora la Guardia |
| **Aruspice corrotto**    | ogni round scambia gli intenti dichiarati dei suoi alleati (li rimescola) |

## Fascia 4 — Custodi (boss in arena)

Multi-fase: a soglia di PV cambiano mazzo di intenti E l'arena reagisce.
Il PRIMO custode della discesa non ha fase 2 (la regola ereditata).
Ogni custode lascia un bottino maggiore (arma unica o reliquia).

### EQUUS OCTOBER — Campo Marzio (primo custode)

Cavallo sacrificale in fiamme. Una sola fase, pattern chiari: il tutorial
dei custodi.
- 🐗 **Carica** (colpisce SOLO la mischia: cambia fila!)
- 💀 **Soffio di brace** (inevitabile, area: Guardia e incassa)
- ⛨ **Impennata** (si prepara: interrompibile; se riesce, ⚔ 14)
- L'arena: bracieri ai lati si accendono a round alterni — chi finisce
  il turno nella fila adiacente prende Bruciatura.

### CORNELIA, LA SEPOLTA VIVA — Necropoli dell'Appia

Fase 1: mani dal terreno (🏹 da qualsiasi fila), lamento (evoca ombre).
Fase 2 (sotto il 50%): il pianto — ogni cura è dimezzata, i suoi
intenti diventano visibili solo con Presagio o a metà round. L'arena si
restringe: una fila crolla.

### IL PALLADIO — la Regia

Fase 1: combo di lancia (⚔⚔), lancio (🏹 non schivabile sulla retrovia).
Fase 2 (sotto il 50%): il risveglio — tinta d'oro, +1 azione per round,
💀 schianto ogni 3 round. Reliquia finale: l'**ENSIS FLAMMEUS**.

## Regole trasversali

- Il drop delle fasce 1–2 resta RARO (≤10%) e differenziato per famiglia
  (fauna: materiali/cibo; creature: balsami e incensi).
- Ogni scheda dichiara le proprie immunità (poche e tematiche).
- Lo Stordimento non è mai concatenabile sullo stesso bersaglio.
- Nuove aggiunte = nuova `.tres` + sprite + riga di bundle testi. Zero
  codice.
