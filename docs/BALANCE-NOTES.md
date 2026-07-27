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
