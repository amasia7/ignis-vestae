import Phaser from 'phaser';
import { H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { RUN } from '../core/RunState';
import { gameEvents } from '../core/EventBus';
import { WEAPONS } from '../data/weapons';
import { ITEMS } from '../data/items';
import { actionKeyLabel } from '../input/bindings';
import { T, textStyle } from '../ui/text';
import type { Player } from '../entities/Player';
import type { BossBase } from '../entities/bosses/BossBase';
import type { TextureKey } from '../art/registry';

/** Ciò che l'HUD chiede alla scena di gioco sottostante (fight o livello). */
interface GameplayScene extends Phaser.Scene {
  player: Player;
  boss: BossBase | null;
}

/**
 * HUD sopra la scena di gioco: barre, ampolle, ricarica abilità, slot arma,
 * borsa, recap dei controlli sempre visibile in alto a sinistra e barra del
 * boss quando c'è un boss.
 */
export class HudScene extends Phaser.Scene {
  private target = 'fight';
  private gfx!: Phaser.GameObjects.Graphics;
  private abLabel!: Phaser.GameObjects.Text;
  private bossName!: Phaser.GameObjects.Text;
  private recap!: Phaser.GameObjects.Text;
  private weaponIcon!: Phaser.GameObjects.Image;
  private quickIcon!: Phaser.GameObjects.Image;
  private quickLabel!: Phaser.GameObjects.Text;
  private root!: Phaser.GameObjects.Container;

  constructor() {
    super('hud');
  }

  init(data: { target?: string }): void {
    this.target = data.target ?? 'fight';
  }

  create(): void {
    // l'ordine di registrazione non conta: l'HUD sta sempre sopra il gioco
    this.scene.bringToTop();
    const s = strings();
    this.gfx = this.add.graphics();
    this.abLabel = this.add.text(
      0,
      0,
      s.classes[RUN.classIdx]?.abilityName ?? '',
      textStyle(10, 'rgba(200,182,140,0.9)'),
    );

    // recap dei controlli, sempre visibile in alto a sinistra
    this.recap = this.add.text(22, 84, this.recapText(), {
      ...textStyle(12, 'rgba(216,201,163,0.8)'),
      lineSpacing: 4,
    });
    const offSettings = gameEvents.on('settings:changed', () =>
      this.recap.setText(this.recapText()),
    );
    this.events.once('shutdown', offSettings);

    // slot arma + oggetto rapido (a destra della barra della vita)
    this.weaponIcon = this.add.image(282, 35, WEAPONS[RUN.equippedWeapon].textureKey as TextureKey);
    this.quickIcon = this.add.image(332, 33, ITEMS[RUN.quickItem].textureKey as TextureKey);
    this.quickLabel = this.add.text(343, 39, '', textStyle(10, 'rgba(200,182,140,0.9)'));

    const fight = this.scene.get(this.target) as GameplayScene;
    this.bossName = T(
      this,
      W / 2,
      H - 58,
      fight.boss ? strings().bosses[fight.boss.id].name : '',
      15,
      '#d8c9a3',
    );
    const arena = T(this, W - 20, 22, s.arenas[RUN.bossIdx] ?? '', 12, 'rgba(163,146,122,0.85)');
    arena.setOrigin(1, 0.5);
    this.root = this.add.container(0, 0, [
      this.gfx,
      this.abLabel,
      this.recap,
      this.weaponIcon,
      this.quickIcon,
      this.quickLabel,
      this.bossName,
      arena,
    ]);
  }

  /** Righe del recap generate dai binding correnti (si aggiornano rimappando). */
  private recapText(): string {
    const s = strings().hud;
    const k = actionKeyLabel;
    return [
      `${k('MOVE_LEFT')} ${k('MOVE_RIGHT')} ${s.move} · ${k('JUMP')} ${s.jump}`,
      `${k('ATTACK')} ${s.attack} · ${k('SHIELD')} ${s.shield}`,
      `${k('ROLL')} ${s.roll} · ${k('HEAL')} ${s.heal} · ${k('ABILITY')} ${s.ability}`,
      `${k('QUICK_ITEM')} ${s.quickItem} · ${k('CYCLE_ITEM')} ${s.cycleItem} · ${k('INVENTORY')} ${s.bag}`,
      s.mouse,
    ].join('\n');
  }

  /** Il gioco sotto si oscura alla morte: l'HUD si attenua in sincrono. */
  dim(alpha: number, duration: number): void {
    this.tweens.add({ targets: this.root, alpha, duration });
  }

  update(): void {
    const scene = this.scene.get(this.target) as GameplayScene | null;
    if (!scene || !scene.player) return;
    const g = this.gfx;
    const p = scene.player;
    const b = scene.boss;
    g.clear();
    // vita / resistenza
    g.fillStyle(0x000000, 0.5);
    g.fillRect(22, 20, 224, 15);
    g.fillStyle(0xa4302a, 1);
    g.fillRect(24, 22, 220 * Math.max(0, p.hp / p.mhp), 11);
    g.fillStyle(0x000000, 0.5);
    g.fillRect(22, 38, 174, 11);
    g.fillStyle(0xb7a24a, 1);
    g.fillRect(24, 40, 170 * Math.max(0, p.stamina.value / p.stamina.max), 7);
    // slot arma
    g.fillStyle(0x000000, 0.5);
    g.fillRoundedRect(258, 20, 48, 30, 4);
    g.lineStyle(1.5, 0x6d5f3a, 1);
    g.strokeRoundedRect(258, 20, 48, 30, 4);
    const weaponKey = WEAPONS[RUN.equippedWeapon].textureKey as TextureKey;
    if (this.weaponIcon.texture.key !== weaponKey) this.weaponIcon.setTexture(weaponKey);
    // slot oggetto rapido (rotella / F): icona + quantità in borsa
    g.fillStyle(0x000000, 0.5);
    g.fillRoundedRect(314, 20, 48, 30, 4);
    g.lineStyle(1.5, 0x6d5f3a, 1);
    g.strokeRoundedRect(314, 20, 48, 30, 4);
    const quickKey = ITEMS[RUN.quickItem].textureKey as TextureKey;
    if (this.quickIcon.texture.key !== quickKey) this.quickIcon.setTexture(quickKey);
    const quickCount = RUN.countOf(RUN.quickItem);
    this.quickIcon.setAlpha(quickCount > 0 ? 1 : 0.35);
    this.quickLabel.setText(`×${quickCount}`);
    // ampolle
    for (let i = 0; i < p.mfl; i++) {
      g.fillStyle(i < p.fl ? 0x7fb7d8 : 0x2a2a33, 1);
      g.fillCircle(32 + i * 18, 62, 5.5);
      g.fillStyle(i < p.fl ? 0xbfe3f5 : 0x3a3a44, 1);
      g.fillRect(30 + i * 18, 53, 4, 4);
    }
    // abilità con ricarica
    const ax = 36 + p.mfl * 18 + 16;
    const ay = 61;
    const ready = p.abCd <= 0;
    g.fillStyle(0x000000, 0.5);
    g.fillCircle(ax, ay, 11);
    g.fillStyle(ready ? 0xe8cf7a : 0x6b6154, 1);
    g.fillCircle(ax, ay, 3.5);
    if (!ready) {
      const f = p.abCd / p.abMax;
      g.fillStyle(0x08060c, 0.78);
      g.slice(ax, ay, 11, -Math.PI / 2, -Math.PI / 2 + f * Math.PI * 2, false);
      g.fillPath();
    }
    g.lineStyle(1.5, ready ? 0xc9a227 : 0x4a3c26, 1);
    g.strokeCircle(ax, ay, 11);
    this.abLabel.setPosition(ax + 18, ay - 6);
    // barra del boss (solo dove c'è un boss)
    if (b && !b.dead) {
      this.bossName.setVisible(true);
      g.fillStyle(0x000000, 0.5);
      g.fillRect(W / 2 - 282, H - 46, 564, 13);
      g.fillStyle(0x8e2f2f, 1);
      g.fillRect(W / 2 - 280, H - 44, 560 * Math.max(0, b.hp / b.mhp), 9);
    } else this.bossName.setVisible(false);
  }
}
