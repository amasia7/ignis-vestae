import Phaser from 'phaser';
import { H, W } from '../config/game.config';
import { strings } from '../data/i18n';
import { RUN } from '../core/RunState';
import { T } from '../ui/text';
import type { FightScene } from './FightScene';

/**
 * HUD come scena separata sopra la FightScene: disegna vita, resistenza,
 * ampolle, ricarica abilità e barra del boss (port di drawHud, r. 906-933).
 */
export class HudScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private abLabel!: Phaser.GameObjects.Text;
  private bossName!: Phaser.GameObjects.Text;
  private root!: Phaser.GameObjects.Container;

  constructor() {
    super('hud');
  }

  create(): void {
    const s = strings();
    this.gfx = this.add.graphics();
    this.abLabel = this.add.text(0, 0, s.classes[RUN.classIdx]?.abilityName ?? '', {
      fontFamily: 'Georgia, serif',
      fontSize: '10px',
      color: 'rgba(141,124,92,0.85)',
    });
    const fight = this.scene.get('fight') as FightScene;
    this.bossName = T(this, W / 2, H - 58, strings().bosses[fight.boss.id].name, 15, '#d8c9a3');
    const arena = T(this, W - 20, 22, s.arenas[RUN.bossIdx] ?? '', 12, 'rgba(141,124,92,0.7)');
    arena.setOrigin(1, 0.5);
    this.root = this.add.container(0, 0, [this.gfx, this.abLabel, this.bossName, arena]);
  }

  /** Il gioco sotto si oscura alla morte: l'HUD si attenua in sincrono. */
  dim(alpha: number, duration: number): void {
    this.tweens.add({ targets: this.root, alpha, duration });
  }

  update(): void {
    const fight = this.scene.get('fight') as FightScene | null;
    if (!fight || !fight.player) return;
    const g = this.gfx;
    const p = fight.player;
    const b = fight.boss;
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
    // barra del boss
    if (b && !b.dead) {
      this.bossName.setVisible(true);
      g.fillStyle(0x000000, 0.5);
      g.fillRect(W / 2 - 282, H - 46, 564, 13);
      g.fillStyle(0x8e2f2f, 1);
      g.fillRect(W / 2 - 280, H - 44, 560 * Math.max(0, b.hp / b.mhp), 9);
    } else this.bossName.setVisible(false);
  }
}
