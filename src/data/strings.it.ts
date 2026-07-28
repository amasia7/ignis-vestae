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
    hintControls:
      'A/D muoversi · W salto · J colpo · L pesante · K/SPAZIO schivata · H ampolla · U abilità',
    hintRoll: 'La schivata attraversa gli attacchi. La resistenza governa ogni gesto.',
    // novità Fase 8
    continuePrefix: 'C  —  riprendi il rito: ',
    settingsHint: 'O  —  impostazioni',
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
  ],

  bosses: {
    // legacy r. 428, 482, 561
    equus: { name: 'EQUUS OCTOBER', sub: 'Il Cavallo Immolato' },
    cornelia: { name: 'CORNELIA', sub: 'La Sepolta Viva' },
    palladio: { name: 'IL PALLADIO', sub: 'Custode Caduto di Troia' },
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
  },

  victory: {
    // legacy r. 974-979
    title: 'IGNIS  RENATUS',
    epilogue:
      'Il focolare accoglie la scintilla.\nFinché una sola mano custodisce la fiamma,\nla Città non è caduta.',
    backTouch: '—  tocca: torna al titolo  —',
    backKey: '—  INVIO: torna al titolo  —',
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
      LIGHT: 'colpo leggero',
      HEAVY: 'colpo pesante',
      ROLL: 'schivata',
      HEAL: 'ampolla',
      ABILITY: 'abilità',
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
    // legacy r. 226-233
    left: '◀',
    right: '▶',
    light: '🗡',
    roll: '◌',
    jump: '⤒',
    heavy: '†',
    ability: '✦',
    heal: '✚',
  },
};
