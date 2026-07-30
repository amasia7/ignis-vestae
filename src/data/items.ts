/**
 * Oggetti utili trovabili nella run (drop dei nemici o raccolti nei
 * livelli), custoditi nella borsa e usabili dall'inventario o come
 * oggetto rapido (rotella del mouse / tasto dedicato).
 */
export type ItemId = 'balsamo' | 'incenso'; // @scaffold:item-id

export interface ItemData {
  readonly id: ItemId;
  readonly textureKey: string;
  readonly effect: 'heal' | 'stamina';
  readonly amount: number;
}

export const ITEMS: Readonly<Record<ItemId, ItemData>> = {
  balsamo: { id: 'balsamo', textureKey: 'balsamo', effect: 'heal', amount: 30 },
  incenso: { id: 'incenso', textureKey: 'incenso', effect: 'stamina', amount: 60 },
  // @scaffold:item-data
};
