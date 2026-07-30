# Balance notes

Valori del legacy che sollevano un dubbio durante la lettura. **Nessuno è stato
modificato**: la migrazione li trasferisce tali e quali. Ogni voce attende una decisione
del committente.

1. **Slam del Palladio: windup non scalato in fase 2** (r. 610, `const wu=330;`).
   Tutti gli altri windup del Palladio sono moltiplicati per `sp` (0.68 in fase 2):
   combo 270·sp, lancia 470·sp. Lo slam resta a 330 fissi anche in fase 2, e anche il
   suo cooldown (700) e la durata del volo (570) sono fissi. Intenzionale (lo slam è già
   l'attacco più forte) o svista? → Migrato com'è: 330 fisso.

2. **Enrage di Equus senza cambio di stato visibile** (r. 432, `sp=this.hp<this.mhp/2?0.75:1`).
   Equus accelera del 25% sotto 150 hp ma, a differenza di Cornelia (fase a 170) e
   Palladio (risveglio a 230), non ha alcun segnale visivo o sonoro di transizione.
   Coerente con l'idea "enrage silenzioso"? → Migrato com'è.

3. **Il danno da contatto della carica di Equus è continuo** (r. 451): durante la corsa
   `rectHit` è chiamato ogni frame; è l'invulnerabilità post-colpo del player (900ms) a
   impedire hit multipli, non un flag del boss. Stesso schema per il grab di Cornelia e
   la combo del Palladio. È il comportamento che dà il feel attuale → replicato
   identico (l'interprete dei pattern non introdurrà "un colpo per attivazione").

4. **`jumpHeld()` su touch è sempre vero** (r. 246): su dispositivi touch il salto è
   sempre ad altezza piena (niente taglio a −220). Presunta scelta deliberata per il
   VPad → migrato com'è.

5. **Il dardo di FIAMMA VOTIVA (26·mult) beneficia di MOLA SALSA** come i colpi in
   mischia e IRA SACRILEGA (tutti passano da `mult`), quindi la reliquia potenzia anche
   le abilità, non solo "il ferro" come dice il testo. → Migrato com'è.

---

## §6 — Divergenze VOLUTE dal legacy (rework del 2026-07)

Dal grande rework richiesto dal committente («non attenerti alla pagina web
html iniziale») questi valori DIVERGONO deliberatamente dal legacy. La regola
«i numeri non si toccano» resta valida per tutto il resto.

6.1 **Salto potenziato per la verticalità** (`config/balance.ts`):
    jumpVelocity −560 → **−680**, jumpCutVelocity −220 → **−260**,
    coyoteMs 90 → **120**, jumpBufferMs 130 → **160**. Serve a rendere il
    platforming dei nuovi livelli (piattaforme a quota 350 e 258) comodo.

6.2 **Roll riscritto, +30% di efficacia**: velocity 580 → **754**,
    maxVelocity 620 → **806**, durationMs 380 → **460**, i-frame 50–300 →
    **40–370**. L'animazione è una capriola completa (rotazione 2π).

6.3 **Attacco a tasto unico**: niente più tasto del colpo pesante; tap =
    leggero, pressione oltre `attackChargeMs` (**260ms**) = pesante. Danni,
    costi e finestre dei due colpi restano quelli del legacy.

6.4 **Scudo delle classi pesanti** (`shield`): parata in mantenimento che
    assorbe il 70% del danno al costo di 8 di vigore per colpo. Novità del
    rework, nessun equivalente legacy.

6.5 **Fase 2 dei boss**: Equus (primo boss) NON ha più la fase 2 (il legacy
    aveva l'enrage silenzioso a metà vita, vedi §2). Cornelia e Palladio sono
    più duri del legacy: speedMult 0.72/0.68 → **0.66/0.62** e nuovo
    `damageMult` **1.25/1.3**. L'ingresso in fase 2 è annunciato (anello
    porpora + scossa).

6.6 **Nuova mossa di Equus**: ONDA BASSA (`EQUUS.wave`), scavalcabile solo
    col salto — parte della grammatica «telegrafi colorati» (azzurro = salta,
    oro = schiva, porpora = incassa/para) introdotta dal rework.

6.7 **Drop dei nemici ridotto**: ombra 0.25 → 0.10, larva 0.15 → 0.07; i
    nuovi guerriero/arciere/segugio nascono già parchi (0.10/0.08/0.10).
