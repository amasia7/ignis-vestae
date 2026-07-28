/**
 * Forma del bundle di stringhe. Ogni lingua (strings.it.ts oggi, strings.en.ts
 * domani) implementa questa interfaccia: il compilatore garantisce che nessuna
 * stringa manchi in una traduzione.
 */
export interface ClassStrings {
  readonly name: string;
  readonly sub: string;
  readonly desc: string;
  readonly abilityName: string;
  readonly abilityDesc: string;
  /** Testo della schermata di morte, declinato per genere (r. 43/48/53). */
  readonly death: string;
}

export interface BossStrings {
  readonly name: string;
  readonly sub: string;
}

export interface RelicStrings {
  readonly title: string;
  readonly desc: string;
  readonly fx: string;
}

export interface Strings {
  readonly meta: {
    readonly htmlTitle: string;
    readonly rotate: string;
    readonly rotateSub: string;
  };
  readonly title: {
    readonly logo: string;
    readonly subtitle: string;
    readonly tagline: string;
    readonly startTouch: string;
    readonly startKey: string;
    readonly hintControls: string;
    readonly hintRoll: string;
  };
  readonly select: {
    readonly heading: string;
    readonly hintTouch: string;
    readonly hintKeys: string;
    readonly statVigor: string;
    readonly statStamina: string;
    readonly statStrength: string;
    readonly statSpeed: string;
    readonly abilityPrefix: string;
  };
  readonly lore: {
    readonly pages: readonly (readonly string[])[];
    readonly nextTouch: string;
    readonly nextKey: string;
  };
  readonly classes: readonly [ClassStrings, ClassStrings, ClassStrings];
  readonly bosses: {
    readonly equus: BossStrings;
    readonly cornelia: BossStrings;
    readonly palladio: BossStrings;
  };
  readonly arenas: readonly [string, string, string];
  readonly relics: readonly [RelicStrings, RelicStrings, RelicStrings];
  readonly fight: {
    readonly bossDown: string;
    readonly retryTouch: string;
    readonly retryKey: string;
  };
  readonly interlude: {
    readonly heading: string;
    readonly nextTouch: string;
    readonly nextKey: string;
  };
  readonly victory: {
    readonly title: string;
    readonly epilogue: string;
    readonly backTouch: string;
    readonly backKey: string;
  };
  readonly vpad: {
    readonly left: string;
    readonly right: string;
    readonly light: string;
    readonly roll: string;
    readonly jump: string;
    readonly heavy: string;
    readonly ability: string;
    readonly heal: string;
  };
}
