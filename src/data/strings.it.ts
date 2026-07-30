import type { Strings } from './strings.schema';

/**
 * Ogni stringa mostrata a schermo, in italiano. Copiate CARATTERE PER CARATTERE
 * dal legacy (gli escape \uXXXX sono trascritti come caratteri reali: ’ à è é
 * ò ù À · — ▸ ◀ ▶ ✦). Le spaziature doppie (es. «IGNIS  VESTAE») sono volute.
 * Non riscrivere, non "migliorare", non tradurre.
 */
export const STRINGS_IT: Strings = {
  meta: {
    // legacy r. 6 e r. 18
    htmlTitle: 'Ignis Vestae — un souls-like delle Vestali',
    rotate: 'RUOTA IL TELEFONO',
    rotateSub: 'il rito si celebra in orizzontale',
  },

  title: {
    // legacy r. 698-706
    logo: 'IGNIS  VESTAE',
    subtitle: 'L’ultima fiamma di Roma',
    tagline: 'un souls-like delle Vestali',
    startTouch: '—  TOCCA  LO  SCHERMO  —',
    startKey: '—  PREMI  INVIO  —',
    // aggiornato ai nuovi comandi richiesti (frecce + A/S/Q/E)
    hintControls:
      '◀ ▶ muoversi · ↑ salto · A colpo · Q pesante · S schivata · H ampolla · E abilità · I borsa',
    hintRoll: 'La schivata attraversa gli attacchi. La resistenza governa ogni gesto.',
    // novità Fase 8
    continuePrefix: 'C  —  riprendi il rito: ',
    settingsHint: 'O  —  impostazioni',
  },

  // menu principale a voci
  menu: {
    newGame: 'NUOVA PARTITA',
    continue: 'CONTINUA',
    levels: 'LIVELLI',
    settings: 'IMPOSTAZIONI',
    info: 'INFO',
    hint: '↑ ↓ scegliere · INVIO confermare',
  },
  slots: {
    titleNew: 'NUOVA PARTITA — scegli il sigillo',
    titleContinue: 'CONTINUA — scegli il sigillo',
    titleLevels: 'LIVELLI — scegli il sigillo',
    empty: 'sigillo intatto',
    slot: 'SIGILLO',
    overwrite: 'occupato — INVIO di nuovo per sovrascrivere',
    hint: '↑ ↓ scegliere · INVIO confermare · ESC tornare',
  },
  levelSelect: {
    title: 'CAMMINI COMPLETATI',
    hint: '↑ ↓ ◀ ▶ scegliere · INVIO rigioca · ESC tornare',
    none: 'Nessun cammino ancora completato in questo sigillo.',
    world: 'MONDO',
    path: 'CAMMINO',
  },
  info: {
    title: 'INFO',
    body:
      'IGNIS VESTAE — un souls-like delle Vestali.\n\n' +
      'Anno 394: il fuoco sacro è stato spento per editto. Attraversa i ' +
      'cammini, abbatti i custodi corrotti, riporta le reliquie al focolare.\n\n' +
      'Tre mondi, cinque cammini ciascuno, un custode alla fine di ogni mondo. ' +
      'Nei cammini si nascondono urne con armi e benedizioni: spezzale.\n\n' +
      'La schivata attraversa gli attacchi. La resistenza governa ogni gesto.\n\n' +
      'Prototipo e testi: il committente. Migrazione e codice: bottega di Claude.',
  },

  select: {
    // legacy r. 719-741
    heading: 'SCEGLI  IL  TUO  VOTO',
    hintTouch: 'tocca la carta · tocca ancora per confermare',
    hintKeys: '◀ ▶ per scegliere · INVIO per confermare',
    statVigor: 'VIGORE',
    statStamina: 'RESISTENZA',
    statStrength: 'FORZA',
    statSpeed: 'RAPIDITÀ',
    abilityPrefix: '✦ ',
  },

  lore: {
    // legacy r. 59-63 e r. 769
    pages: [
      [
        'Anno 394 dell’era volgare.',
        'Per editto imperiale, il fuoco che ardeva',
        'da undici secoli è stato spento.',
        'Le sacerdotesse disperse. L’Atrium chiuso.',
      ],
      [
        'Ma un fuoco spento per mano d’uomo',
        'non muore in pace.',
        'Nel Penus, la stanza segreta del tempio,',
        'le reliquie hanno cominciato a sognare.',
        'E i loro custodi si sono levati, corrotti.',
      ],
      [
        'Tu scendi con il tuo voto e il tuo ferro.',
        'Riprendi ciò che era custodito.',
        'Riaccendi ciò che non doveva spegnersi.',
      ],
    ],
    nextTouch: 'tocca ▸',
    nextKey: 'INVIO  ▸',
  },

  classes: [
    // legacy r. 39-43
    {
      name: 'VESTALE',
      sub: 'L’ultima custode',
      desc: 'Equilibrata in ogni cosa. Il fuoco le fu tolto: verrà a riprenderselo.',
      abilityName: 'FIAMMA VOTIVA',
      abilityDesc: 'scaglia una lingua di fuoco sacro (ricarica 8s)',
      death: 'SEI  PERITA',
    },
    // legacy r. 44-48
    {
      name: 'SACERDOTE RINNEGATO',
      sub: 'Il guerriero sacrilego',
      desc: 'Lento, corazzato, brutale. Ha rinnegato gli dèi, non la guerra.',
      abilityName: 'IRA SACRILEGA',
      abilityDesc: 'devastazione d’area attorno a sé (ricarica 12s)',
      death: 'SEI  PERITO',
    },
    // legacy r. 49-53
    {
      name: 'ARUSPICE',
      sub: 'Il lettore di presagi',
      desc: 'Fragile e rapidissimo. Ha già letto nelle viscere come finisce.',
      abilityName: 'PRESAGIO',
      abilityDesc: 'etereo e veloce per 2,5s: nulla lo tocca (ricarica 14s)',
      death: 'SEI  PERITO',
    },
    // @scaffold:class-strings
  ],

  bosses: {
    // legacy r. 428, 482, 561
    equus: { name: 'EQUUS OCTOBER', sub: 'Il Cavallo Immolato' },
    cornelia: { name: 'CORNELIA', sub: 'La Sepolta Viva' },
    palladio: { name: 'IL PALLADIO', sub: 'Custode Caduto di Troia' },
    // @scaffold:boss-strings
  },

  // legacy r. 75
  arenas: [
    'Campo Marzio, la notte degli Equirria',
    'Campus Sceleratus, la terra delle sepolte',
    'Penus Vestae, la stanza segreta',
  ],

  relics: [
    // legacy r. 65-67
    {
      title: 'SUFFIMEN',
      desc: 'Cenere del Cavallo d’Ottobre, immolato al dio degli eserciti. Mescolata al sangue rappreso e arsa sul focolare, purifica ciò che la mano dell’uomo ha macchiato. Il cavallo correva ancora, nella morte. Ora corre nel fuoco.',
      fx: 'Un’ampolla d’acqua di Egeria in più.',
    },
    // legacy r. 68-70
    {
      title: 'MOLA SALSA',
      desc: 'Farina di farro e sale, macinata dalle mani delle vergini nelle notti di maggio. Nessuna offerta giunge agli dèi, se prima non è cosparsa di questo. Chi la portava sottoterra, continuò a macinarla nel buio.',
      fx: 'Il tuo ferro è consacrato: danno aumentato.',
    },
    // legacy r. 71-73
    {
      title: 'IL PALLADIO',
      desc: 'Simulacro caduto dal cielo su Troia in fiamme. Finché dimora nella Città, la Città non cade. Enea lo portò attraverso il mare; le vergini, attraverso il fuoco. Ora torna al focolare.',
      fx: 'Il fuoco può essere riacceso.',
    },
  ],

  fight: {
    // legacy r. 838 e r. 849
    bossDown: 'CUSTODE  ANNIENTATO',
    retryTouch: 'tocca: rialzati al braciere',
    retryKey: 'INVIO: rialzati al braciere',
  },

  interlude: {
    // legacy r. 946-950
    heading: 'RELIQUIA  RECUPERATA',
    nextTouch: '—  tocca: riposa al braciere e prosegui  —',
    nextKey: '—  INVIO: riposa al braciere e prosegui  —',
    bounty: 'BOTTINO DEL CUSTODE',
  },

  victory: {
    // legacy r. 974-979
    title: 'IGNIS  RENATUS',
    epilogue:
      'Il focolare accoglie la scintilla.\nFinché una sola mano custodisce la fiamma,\nla Città non è caduta.',
    backTouch: '—  tocca: torna al titolo  —',
    backKey: '—  INVIO: torna al titolo  —',
  },

  // recap dei controlli nell'HUD (etichette brevi)
  hud: {
    move: 'muoversi',
    jump: 'salto',
    attack: 'colpo (tieni: pesante)',
    shield: 'scudo',
    roll: 'schivata',
    heal: 'ampolla',
    ability: 'abilità',
    bag: 'borsa',
    quickItem: 'oggetto rapido',
    cycleItem: 'cambia oggetto',
    mouse: 'mouse: SX colpo · DX difesa · rotella oggetto',
  },

  // armi e oggetti
  weapons: {
    secespita: {
      name: 'SECESPITA',
      desc: 'Il coltello sacrificale delle Vestali. Conosce la carne e il rito.',
      fx: 'Il ferro della tua iniziazione: danno consueto.',
    },
    spatha: {
      name: 'SPATHA',
      desc: 'La lama lunga del guerriero sacrilego. Pesante di colpe.',
      fx: 'Il ferro della tua iniziazione: danno consueto.',
    },
    lituus: {
      name: 'LITUUS',
      desc: 'Il bastone ricurvo degli àuguri. Scrive presagi nell’aria.',
      fx: 'Il ferro della tua iniziazione: danno consueto.',
    },
    gladius: {
      name: 'GLADIO CONSACRATO',
      desc: 'Ferro di legionario caduto scortando le reliquie, cosparso di mola salsa dalle vergini in fuga.',
      fx: 'In pugno: ogni colpo infligge il 10% di danno in più.',
    },
    falx: {
      name: 'FALX VOTIVA',
      desc: 'Falce tracia deposta come ex voto e mai più ritirata. La curva della lama ricorda una luna calante.',
      fx: 'In pugno: danno aumentato del 5%.',
    },
    dolabra: {
      name: 'DOLABRA DEI GENIERI',
      desc: 'Piccone-scure di chi scavò il Campus Sceleratus. Ha aperto la terra; apre anche gli spettri.',
      fx: 'In pugno: danno aumentato del 15%.',
    },
    hasta: {
      name: 'HASTA PURA',
      desc: 'L’asta senza ferro dei trionfi, ma questa una punta ce l’ha: fu intinta nel fuoco sacro.',
      fx: 'In pugno: danno aumentato del 25%.',
    },
  },
  items: {
    balsamo: {
      name: 'BALSAMO DI EGERIA',
      desc: 'Unguento della ninfa che dettò a Numa i riti. Le sue acque rimarginano ciò che il fuoco non può.',
      fx: 'Dalla borsa: ridona 30 punti di vita.',
    },
    incenso: {
      name: 'INCENSO SABEO',
      desc: 'Grani di resina d’Arabia, arsi sugli altari. Il fumo scioglie la fatica dalle membra.',
      fx: 'Dalla borsa: ridona 60 punti di vigore.',
    },
  },
  buffs: {
    cenereVotiva: {
      name: 'CENERE VOTIVA',
      desc: 'Un pugno di cenere del primo focolare, cucito in un sacchetto di lino.',
      fx: 'Benedizione: resistenza massima +15.',
    },
    lacrimeEgeria: {
      name: 'LACRIME DI EGERIA',
      desc: 'La ninfa pianse tanto da divenire fonte. Una fiala di quel pianto.',
      fx: 'Benedizione: un’ampolla in più.',
    },
    fuocoInterno: {
      name: 'FUOCO INTERNO',
      desc: 'Brace del Penus inghiottita in sogno. Da allora le gambe non conoscono fatica.',
      fx: 'Benedizione: rapidità +8%.',
    },
    veloSepolta: {
      name: 'VELO DELLA SEPOLTA',
      desc: 'Il velo che Cornelia portò sottoterra. Chi lo indossa non teme la fossa.',
      fx: 'Benedizione: vigore massimo +15.',
    },
    sigilloVesta: {
      name: 'SIGILLO DI VESTA',
      desc: 'Il marchio della dea sul palmo. Ogni colpo è un atto di culto.',
      fx: 'Benedizione: danno +10%.',
    },
  },
  inventory: {
    title: 'BORSA',
    weaponsHeader: 'ARMI',
    itemsHeader: 'OGGETTI',
    buffsHeader: 'BENEDIZIONI',
    hint: '↑ ↓ scegliere · INVIO equipaggia / usa · C imposta rapido · B o ESC chiudere',
    equipped: 'in pugno',
    quickMark: 'rapido',
    empty: 'La borsa è vuota.',
    picked: 'RACCOLTO',
  },

  // livelli intermedi
  level: {
    goal: 'Avanza verso il braciere  ▸',
    rest: 'INVIO: riposa al braciere e affronta il custode',
    restNext: 'INVIO: riposa al braciere e prosegui il cammino',
    world: 'MONDO',
    path: 'CAMMINO',
  },

  // novità Fase 8: pausa e impostazioni
  pause: {
    title: 'PAUSA',
    resume: 'INVIO / ESC  —  riprendi il rito',
    settings: 'O  —  impostazioni',
    quit: 'T  —  abbandona: torna al titolo',
  },
  settingsUi: {
    title: 'IMPOSTAZIONI',
    hint: '↑ ↓ scegliere · ◀ ▶ regolare · INVIO attivare · ESC tornare',
    volume: 'VOLUME',
    shake: 'SCOSSE DELLO SCHERMO',
    on: 'SÌ',
    off: 'NO',
    bindingsHeader: 'COMANDI',
    actions: {
      MOVE_LEFT: 'muoversi a sinistra',
      MOVE_RIGHT: 'muoversi a destra',
      JUMP: 'salto',
      ATTACK: 'colpo (tieni premuto: pesante)',
      SHIELD: 'scudo (classi pesanti)',
      ROLL: 'schivata',
      HEAL: 'ampolla',
      ABILITY: 'abilità',
      QUICK_ITEM: 'oggetto rapido',
      CYCLE_ITEM: 'cambia oggetto rapido',
      INVENTORY: 'borsa',
      CONFIRM: 'conferma',
      PAUSE: 'pausa',
    },
    pressKey: 'premi un tasto…',
    resetSave: 'CANCELLA SALVATAGGIO E RECORD',
    resetDone: 'cancellato',
    bestTimes: 'TEMPI MIGLIORI',
    noTime: '—',
  },
  vpad: {
    left: '◀',
    right: '▶',
    attack: '🗡',
    roll: '◌',
    jump: '⤒',
    shield: '⛨',
    ability: '✦',
    heal: '✚',
    quick: '◈',
  },
};
