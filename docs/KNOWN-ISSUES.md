# Known issues (legacy)

Comportamenti del legacy che sembrano bug o edge case. **Non corretti d'iniziativa**: la
migrazione li replica finché il committente non decide diversamente. Riferimenti alle
righe di `legacy/ignis-vestae.html`.

1. **Morte simultanea: la vittoria vince sulla morte** (r. 862–869). Se il boss muore e
   il player muore nello stesso frame (o durante la dissolvenza del boss, es. per una
   fiamma a terra ancora attiva), `this.over` blocca solo l'update del player: il ramo
   `b.dead` continua a girare e dopo 1800ms passa comunque a Interlude, sopra la
   schermata di morte. Raro ma possibile (fiamme di Equus persistono 4s dopo la sua
   morte). → Replicato; da decidere se in futuro la morte debba avere priorità.

2. **Input buffered tra sorgenti diverse** (r. 245–251): in `Controls.jump()` (e simili)
   l'OR va in corto circuito, quindi se tastiera e touch scattano nello stesso frame il
   `consume()` del VPad non viene chiamato e la pressione touch resta in coda al frame
   successivo. Irrilevante nell'uso reale (una sorgente alla volta); l'InputManager
   nuovo dovrà comunque consumare tutte le sorgenti per parità di comportamento.

3. **Il tasto `R` è mappato ma quasi mai usato** (r. 240): è nella lista dei tasti e
   funziona solo come retry dopo la morte (r. 852). Non documentato nell'hint comandi
   della Title. → Mantenuto identico.

4. **`RUN.cls` sopravvive al ritorno al titolo** (r. 980): Victory resetta `bossIdx` e
   `relics` ma non la classe; alla Select successiva la carta preselezionata è l'ultima
   giocata. Sembra intenzionale (comodità) → replicato, e con il SaveManager diventerà
   esplicito.

5. **Lo smite colpisce solo sull'asse X** (r. 829): IRA SACRILEGA controlla
   `|boss.x − player.x| < 135` ignorando la quota; colpirebbe il Palladio anche a metà
   del salto-schianto. Coerente col gioco (i boss stanno quasi sempre a terra) →
   replicato.

6. **Le fiamme del soffio di Equus possono ammucchiarsi sul clamp** (r. 469, 816): le 4
   fiamme nascono a `x+face·(50+i·66)` e vengono clampate a 40…W−40; vicino al muro più
   fiamme collassano sulla stessa x, sommando visivamente le particelle (il danno resta
   uno per tick grazie a `fireCd`). → Replicato.
