import Phaser from 'phaser';
import { H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { WEAPONS, type WeaponId } from '../data/weapons';
import { ITEMS, type ItemId } from '../data/items';
import { RUN } from '../core/RunState';
import { SaveManager } from '../core/SaveManager';
import { GamepadMenu } from '../input/GamepadMenu';
import { beep } from '../fx/audio';
import { T, textStyle } from '../ui/text';
import type { Player } from '../entities/Player';
import type { TextureKey } from '../art/registry';

type Row = { kind: 'weapon'; id: WeaponId } | { kind: 'item'; id: ItemId; index: number };

/**
 * La borsa (tasto I): slot arma + oggetti trovati nella run.
 * Overlay sopra fight o livello, che resta in pausa sotto.
 */
export class InventoryScene extends Phaser.Scene {
  private from = 'fight';
  private rows: Row[] = [];
  private cursor = 0;
  private rowObjs: Phaser.GameObjects.GameObject[] = [];
  private descText!: Phaser.GameObjects.Text;

  constructor() {
    super('inventory');
  }

  init(data: { from?: string }): void {
    this.from = data.from ?? 'fight';
  }

  create(): void {
    const s = strings().inventory;
    this.cursor = 0;
    this.add.rectangle(W / 2, H / 2, W, H, 0x060409, 0.85);
    this.add.rectangle(W / 2, H / 2, 560, 420, 0x14101f, 0.95).setStrokeStyle(1.5, 0x4a3c26);
    T(this, W / 2, H / 2 - 186, s.title, 26, '#c9a227');
    T(this, W / 2, H / 2 - 158, s.hint, 12, '#a3927a');
    this.descText = T(this, W / 2, H / 2 + 176, '', 13, '#c9b98f', {
      wordWrap: { width: 500 },
      fontStyle: 'italic',
    });

    this.rebuild();

    const k = this.input.keyboard;
    k?.on('keydown-UP', () => this.move(-1));
    k?.on('keydown-DOWN', () => this.move(1));
    k?.on('keydown-ENTER', () => this.activate());
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
    const items: Row[] = RUN.items.map((id, index) => ({ kind: 'item', id, index }));
    return [...weapons, ...items];
  }

  private rebuild(): void {
    const s = strings();
    this.rowObjs.forEach((o) => o.destroy());
    this.rowObjs = [];
    this.rows = this.buildRows();
    if (this.cursor >= this.rows.length) this.cursor = Math.max(0, this.rows.length - 1);

    const x0 = W / 2 - 250;
    let y = H / 2 - 118;
    const header = (label: string): void => {
      this.rowObjs.push(this.add.text(x0, y, label, textStyle(13, '#8d7c5c')).setOrigin(0, 0.5));
      y += 28;
    };
    let rowIdx = 0;

    header(s.inventory.weaponsHeader);
    for (const row of this.rows.filter((r) => r.kind === 'weapon')) {
      this.drawRow(row, rowIdx, x0, y);
      y += 34;
      rowIdx++;
    }
    y += 10;
    header(s.inventory.itemsHeader);
    const items = this.rows.filter((r) => r.kind === 'item');
    if (items.length === 0)
      this.rowObjs.push(
        this.add.text(x0 + 36, y, s.inventory.empty, textStyle(13, '#6d6048')).setOrigin(0, 0.5),
      );
    for (const row of items) {
      this.drawRow(row, rowIdx, x0, y);
      y += 34;
      rowIdx++;
    }
    this.refreshDesc();
  }

  private drawRow(row: Row, rowIdx: number, x0: number, y: number): void {
    const s = strings();
    const selected = rowIdx === this.cursor;
    const color = selected ? '#e8cf7a' : '#d8c9a3';
    const texKey = (
      row.kind === 'weapon' ? WEAPONS[row.id].textureKey : ITEMS[row.id].textureKey
    ) as TextureKey;
    const name = row.kind === 'weapon' ? s.weapons[row.id].name : s.items[row.id].name;
    const suffix =
      row.kind === 'weapon' && RUN.equippedWeapon === row.id ? `   ✦ ${s.inventory.equipped}` : '';
    if (selected)
      this.rowObjs.push(this.add.rectangle(W / 2, y, 540, 30, 0x3a2c14, 0.5).setOrigin(0.5, 0.5));
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
      return;
    }
    this.descText.setText(row.kind === 'weapon' ? s.weapons[row.id].desc : s.items[row.id].desc);
  }

  private move(dir: number): void {
    if (this.rows.length === 0) return;
    this.cursor = (this.cursor + dir + this.rows.length) % this.rows.length;
    beep(260, 0.04, 'sine', 0.02, 0);
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
      if (p && item.effect === 'heal' && p.hp < p.mhp) {
        p.hp = Math.min(p.mhp, p.hp + item.amount);
        RUN.removeItem(row.index);
        beep(880, 0.25, 'sine', 0.05, 120);
      } else {
        beep(120, 0.1, 'square', 0.03, -40); // niente da curare
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
