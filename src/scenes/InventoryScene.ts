import Phaser from 'phaser';
import { H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { WEAPONS, type WeaponId } from '../data/weapons';
import { ITEMS, type ItemId } from '../data/items';
import { BUFFS, type BuffId } from '../data/buffs';
import { RUN } from '../core/RunState';
import { SaveManager } from '../core/SaveManager';
import { GamepadMenu } from '../input/GamepadMenu';
import { beep } from '../fx/audio';
import { T, textStyle } from '../ui/text';
import type { Player } from '../entities/Player';
import type { TextureKey } from '../art/registry';

type Row = { kind: 'weapon'; id: WeaponId } | { kind: 'item'; id: ItemId; count: number };

type Entry =
  | { kind: 'header'; label: string }
  | { kind: 'row'; row: Row; idx: number }
  | { kind: 'buff'; id: BuffId }
  | { kind: 'empty' };

/** Righe visibili nel pannello: oltre, la lista scorre col cursore. */
const MAX_VISIBLE = 10;
const LINE_H = 32;

/**
 * La borsa (tasto B): slot arma + oggetti raggruppati per tipo con la
 * quantità (×2, ×3…) — un tipo, uno slot. La lista scorre se non entra,
 * così non si sovrappone mai al pannello. C imposta l'oggetto rapido.
 */
export class InventoryScene extends Phaser.Scene {
  private from = 'fight';
  private rows: Row[] = [];
  private cursor = 0;
  private scroll = 0;
  private rowObjs: Phaser.GameObjects.GameObject[] = [];
  private descText!: Phaser.GameObjects.Text;
  private fxText!: Phaser.GameObjects.Text;

  constructor() {
    super('inventory');
  }

  init(data: { from?: string }): void {
    this.from = data.from ?? 'fight';
  }

  create(): void {
    const s = strings().inventory;
    this.cursor = 0;
    this.scroll = 0;
    this.add.rectangle(W / 2, H / 2, W, H, 0x060409, 0.85);
    this.add.rectangle(W / 2, H / 2, 600, 460, 0x14101f, 0.95).setStrokeStyle(1.5, 0x4a3c26);
    T(this, W / 2, H / 2 - 206, s.title, 26, '#c9a227');
    T(this, W / 2, H / 2 - 178, s.hint, 12, '#a3927a');
    this.descText = T(this, W / 2, H / 2 + 176, '', 13, '#c9b98f', {
      wordWrap: { width: 540 },
      fontStyle: 'italic',
    });
    this.fxText = T(this, W / 2, H / 2 + 204, '', 13, '#9fd0ea', { wordWrap: { width: 540 } });

    this.rebuild();

    const k = this.input.keyboard;
    k?.on('keydown-UP', () => this.move(-1));
    k?.on('keydown-DOWN', () => this.move(1));
    k?.on('keydown-ENTER', () => this.activate());
    k?.on('keydown-C', () => this.setQuick());
    k?.on('keydown-B', () => this.close());
    k?.on('keydown-I', () => this.close());
    k?.on('keydown-ESC', () => this.close());
    new GamepadMenu(this, {
      up: () => this.move(-1),
      down: () => this.move(1),
      confirm: () => this.activate(),
    });
  }

  private buildRows(): Row[] {
    const weapons: Row[] = RUN.weapons.map((id) => ({ kind: 'weapon', id }));
    const items: Row[] = RUN.itemCounts().map(({ id, count }) => ({ kind: 'item', id, count }));
    return [...weapons, ...items];
  }

  private buildEntries(): Entry[] {
    const s = strings();
    const entries: Entry[] = [];
    entries.push({ kind: 'header', label: s.inventory.weaponsHeader });
    this.rows.forEach((row, idx) => {
      if (row.kind === 'weapon') entries.push({ kind: 'row', row, idx });
    });
    entries.push({ kind: 'header', label: s.inventory.itemsHeader });
    const hasItems = this.rows.some((r) => r.kind === 'item');
    if (!hasItems) entries.push({ kind: 'empty' });
    this.rows.forEach((row, idx) => {
      if (row.kind === 'item') entries.push({ kind: 'row', row, idx });
    });
    if (RUN.buffs.length > 0) {
      entries.push({ kind: 'header', label: s.inventory.buffsHeader });
      for (const id of RUN.buffs) entries.push({ kind: 'buff', id });
    }
    return entries;
  }

  private rebuild(): void {
    const s = strings();
    this.rowObjs.forEach((o) => o.destroy());
    this.rowObjs = [];
    this.rows = this.buildRows();
    if (this.cursor >= this.rows.length) this.cursor = Math.max(0, this.rows.length - 1);

    const entries = this.buildEntries();
    // la finestra visibile insegue il cursore
    const cursorAt = entries.findIndex((e) => e.kind === 'row' && e.idx === this.cursor);
    if (cursorAt >= 0) {
      if (cursorAt < this.scroll) this.scroll = cursorAt;
      if (cursorAt >= this.scroll + MAX_VISIBLE) this.scroll = cursorAt - MAX_VISIBLE + 1;
    }
    this.scroll = Math.max(0, Math.min(this.scroll, Math.max(0, entries.length - MAX_VISIBLE)));

    const x0 = W / 2 - 270;
    const y0 = H / 2 - 148;
    const visible = entries.slice(this.scroll, this.scroll + MAX_VISIBLE);
    visible.forEach((entry, i) => {
      const y = y0 + i * LINE_H;
      if (entry.kind === 'header') {
        this.rowObjs.push(
          this.add.text(x0, y, entry.label, textStyle(13, '#8d7c5c')).setOrigin(0, 0.5),
        );
      } else if (entry.kind === 'empty') {
        this.rowObjs.push(
          this.add.text(x0 + 36, y, s.inventory.empty, textStyle(13, '#6d6048')).setOrigin(0, 0.5),
        );
      } else if (entry.kind === 'buff') {
        const b = BUFFS[entry.id];
        this.rowObjs.push(
          this.add
            .image(x0 + 16, y, 'sigil')
            .setTint(b.tint)
            .setScale(0.85),
        );
        this.rowObjs.push(
          this.add
            .text(
              x0 + 44,
              y,
              `${s.buffs[entry.id].name} — ${s.buffs[entry.id].fx}`,
              textStyle(12, '#b9d8c8'),
            )
            .setOrigin(0, 0.5),
        );
      } else {
        this.drawRow(entry.row, entry.idx, x0, y);
      }
    });
    // frecce di scorrimento quando la lista continua fuori dal pannello
    if (this.scroll > 0)
      this.rowObjs.push(
        this.add.text(W / 2 + 262, y0, '▲', textStyle(13, '#8d7c5c')).setOrigin(0.5),
      );
    if (this.scroll + MAX_VISIBLE < entries.length)
      this.rowObjs.push(
        this.add
          .text(W / 2 + 262, y0 + (MAX_VISIBLE - 1) * LINE_H, '▼', textStyle(13, '#8d7c5c'))
          .setOrigin(0.5),
      );
    this.refreshDesc();
  }

  private drawRow(row: Row, rowIdx: number, x0: number, y: number): void {
    const s = strings();
    const selected = rowIdx === this.cursor;
    const color = selected ? '#e8cf7a' : '#d8c9a3';
    const texKey = (
      row.kind === 'weapon' ? WEAPONS[row.id].textureKey : ITEMS[row.id].textureKey
    ) as TextureKey;
    let name = row.kind === 'weapon' ? s.weapons[row.id].name : s.items[row.id].name;
    if (row.kind === 'item' && row.count > 1) name += `  ×${row.count}`;
    let suffix = '';
    if (row.kind === 'weapon' && RUN.equippedWeapon === row.id)
      suffix = `   ✦ ${s.inventory.equipped}`;
    if (row.kind === 'item' && RUN.quickItem === row.id) suffix = `   ◈ ${s.inventory.quickMark}`;
    if (selected)
      this.rowObjs.push(this.add.rectangle(W / 2, y, 580, 30, 0x3a2c14, 0.5).setOrigin(0.5, 0.5));
    this.rowObjs.push(this.add.image(x0 + 16, y, texKey).setScale(0.9));
    this.rowObjs.push(
      this.add.text(x0 + 44, y, name + suffix, textStyle(14, color)).setOrigin(0, 0.5),
    );
  }

  private refreshDesc(): void {
    const s = strings();
    const row = this.rows[this.cursor];
    if (!row) {
      this.descText.setText('');
      this.fxText.setText('');
      return;
    }
    const entry = row.kind === 'weapon' ? s.weapons[row.id] : s.items[row.id];
    this.descText.setText(entry.desc);
    this.fxText.setText(entry.fx);
  }

  private move(dir: number): void {
    if (this.rows.length === 0) return;
    this.cursor = (this.cursor + dir + this.rows.length) % this.rows.length;
    beep(260, 0.04, 'sine', 0.02, 0);
    this.rebuild();
  }

  /** C: l'oggetto selezionato diventa l'oggetto rapido. */
  private setQuick(): void {
    const row = this.rows[this.cursor];
    if (!row || row.kind !== 'item') return;
    RUN.quickItem = row.id;
    beep(340, 0.08, 'sine', 0.03, 80);
    SaveManager.save();
    this.rebuild();
  }

  private activate(): void {
    const row = this.rows[this.cursor];
    if (!row) return;
    if (row.kind === 'weapon') {
      RUN.equipWeapon(row.id);
      beep(320, 0.2, 'sine', 0.05, 100);
    } else {
      // usa l'oggetto sul player della scena sottostante
      const gameplay = this.scene.get(this.from) as Phaser.Scene & { player?: Player };
      const item = ITEMS[row.id];
      const p = gameplay.player;
      const useful =
        p &&
        ((item.effect === 'heal' && p.hp < p.mhp) ||
          (item.effect === 'stamina' && p.stamina.value < p.stamina.max));
      if (p && useful) {
        if (item.effect === 'heal') p.hp = Math.min(p.mhp, p.hp + item.amount);
        else p.stamina.value = Math.min(p.stamina.max, p.stamina.value + item.amount);
        RUN.consumeItem(row.id);
        beep(880, 0.25, 'sine', 0.05, 120);
      } else {
        beep(120, 0.1, 'square', 0.03, -40); // niente da ristorare
        return;
      }
    }
    SaveManager.save();
    this.rebuild();
  }

  private close(): void {
    this.scene.stop();
    this.scene.resume(this.from);
  }
}
