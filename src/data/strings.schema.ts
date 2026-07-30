import type { Action } from '../input/actions';
import type { BossId } from './bosses';
import type { WeaponId } from './weapons';
import type { ItemId } from './items';
import type { BuffId } from './buffs';

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
    /** Novità Fase 8 (non presenti nel legacy). */
    readonly continuePrefix: string;
    readonly settingsHint: string;
  };
  /** Menu principale a voci. */
  readonly menu: {
    readonly newGame: string;
    readonly continue: string;
    readonly levels: string;
    readonly settings: string;
    readonly info: string;
    readonly hint: string;
  };
  readonly slots: {
    readonly titleNew: string;
    readonly titleContinue: string;
    readonly titleLevels: string;
    readonly empty: string;
    readonly slot: string;
    readonly overwrite: string;
    readonly hint: string;
  };
  readonly levelSelect: {
    readonly title: string;
    readonly hint: string;
    readonly none: string;
    readonly world: string;
    readonly path: string;
  };
  readonly info: {
    readonly title: string;
    readonly body: string;
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
  /** Stesso ordine di CLASSES; il numero di voci è verificato dai test. */
  readonly classes: readonly ClassStrings[];
  /** Una voce per BossId: il compilatore segnala i boss senza testi. */
  readonly bosses: Readonly<Record<BossId, BossStrings>>;
  readonly arenas: readonly string[];
  readonly relics: readonly RelicStrings[];
  readonly fight: {
    readonly bossDown: string;
    readonly retryTouch: string;
    readonly retryKey: string;
    /** Legenda dei colori dei telegrafi del boss (salto/schivata/incasso). */
    readonly legend: string;
  };
  readonly interlude: {
    readonly heading: string;
    readonly nextTouch: string;
    readonly nextKey: string;
    readonly bounty: string;
  };
  readonly victory: {
    readonly title: string;
    readonly epilogue: string;
    readonly backTouch: string;
    readonly backKey: string;
  };
  /** Recap dei controlli sempre visibile nell'HUD (etichette brevi). */
  readonly hud: {
    readonly move: string;
    readonly jump: string;
    readonly attack: string;
    readonly shield: string;
    readonly roll: string;
    readonly heal: string;
    readonly ability: string;
    readonly bag: string;
    readonly quickItem: string;
    readonly cycleItem: string;
    readonly mouse: string;
  };
  /** Armi e oggetti (slot arma + borsa): desc = lore, fx = cosa fa. */
  readonly weapons: Readonly<
    Record<WeaponId, { readonly name: string; readonly desc: string; readonly fx: string }>
  >;
  readonly items: Readonly<
    Record<ItemId, { readonly name: string; readonly desc: string; readonly fx: string }>
  >;
  /** Benedizioni permanenti (segreti dei mondi e bottini dei custodi). */
  readonly buffs: Readonly<
    Record<BuffId, { readonly name: string; readonly desc: string; readonly fx: string }>
  >;
  readonly inventory: {
    readonly title: string;
    readonly weaponsHeader: string;
    readonly itemsHeader: string;
    readonly buffsHeader: string;
    readonly hint: string;
    readonly equipped: string;
    readonly quickMark: string;
    readonly empty: string;
    readonly picked: string;
  };
  /** Livelli intermedi. */
  readonly level: {
    readonly goal: string;
    readonly rest: string;
    readonly restNext: string;
    readonly world: string;
    readonly path: string;
  };
  /** Novità Fase 8: pausa e impostazioni (non presenti nel legacy). */
  readonly pause: {
    readonly title: string;
    readonly resume: string;
    readonly settings: string;
    readonly quit: string;
  };
  readonly settingsUi: {
    readonly title: string;
    readonly hint: string;
    readonly volume: string;
    readonly shake: string;
    readonly on: string;
    readonly off: string;
    readonly bindingsHeader: string;
    readonly actions: Record<Action, string>;
    readonly pressKey: string;
    readonly resetSave: string;
    readonly resetDone: string;
    readonly bestTimes: string;
    readonly noTime: string;
  };
  readonly vpad: {
    readonly left: string;
    readonly right: string;
    readonly attack: string;
    readonly roll: string;
    readonly jump: string;
    readonly shield: string;
    readonly ability: string;
    readonly heal: string;
    readonly quick: string;
  };
}
