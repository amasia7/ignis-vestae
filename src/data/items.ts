/**
 * Oggetti utili trovabili nella run (drop dei nemici o raccolti nei
 * livelli), custoditi nella borsa e usabili dall'inventario.
 */
export type ItemId = 'balsamo'; // @scaffold:item-id

export interface ItemData {
  readonly id: ItemId;
  readonly textureKey: string;
  readonly effect: 'heal';
  readonly amount: number;
}

export const ITEMS: Readonly<Record<ItemId, ItemData>> = {
  balsamo: { id: 'balsamo', textureKey: 'balsamo', effect: 'heal', amount: 30 },
  // @scaffold:item-data
};
