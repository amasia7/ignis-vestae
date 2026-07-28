import Phaser from 'phaser';
import { GROUND } from '../config/game.config';
import { RUN } from '../core/RunState';
import type { FightScene } from '../scenes/FightScene';

/**
 * Overlay di debug, SOLO in dev (import dinamico dietro import.meta.env.DEV:
 * il modulo non esiste nella build di produzione).
 *
 * F1 mostra/nasconde · F2/F3/F4 salta al boss 1/2/3 · F6/F7 -25/+25 hp boss
 * F8 uccide il boss · F9 cura il player
 */
const overlays = new WeakMap<FightScene, DebugOverlay>();

export function toggleDebugOverlay(scene: FightScene): void {
  const existing = overlays.get(scene);
  if (existing) {
    existing.destroy();
    overlays.delete(scene);
  } else {
    overlays.set(scene, new DebugOverlay(scene));
  }
}

class DebugOverlay {
  private gfx: Phaser.GameObjects.Graphics;
  private text: Phaser.GameObjects.Text;
  private keys: { key: string; fn: () => void }[];

  constructor(private fight: FightScene) {
    this.gfx = fight.add.graphics().setDepth(30);
    this.text = fight.add
      .text(12, 84, '', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#8dff8d',
        backgroundColor: 'rgba(0,0,0,0.55)',
        padding: { x: 6, y: 4 },
      })
      .setDepth(30);
    this.keys = [
      { key: 'keydown-F2', fn: () => this.jumpToBoss(0) },
      { key: 'keydown-F3', fn: () => this.jumpToBoss(1) },
      { key: 'keydown-F4', fn: () => this.jumpToBoss(2) },
      { key: 'keydown-F6', fn: () => this.addBossHp(-25) },
      { key: 'keydown-F7', fn: () => this.addBossHp(25) },
      { key: 'keydown-F8', fn: () => fight.dmgBoss(999999) },
      {
        key: 'keydown-F9',
        fn: () => {
          fight.player.hp = fight.player.mhp;
        },
      },
    ];
    for (const k of this.keys) fight.input.keyboard?.on(k.key, k.fn);
    fight.events.on('postupdate', this.draw, this);
    fight.events.once('shutdown', () => this.destroy());
  }

  private jumpToBoss(idx: number): void {
    RUN.bossIdx = idx;
    this.fight.scene.restart();
  }

  private addBossHp(delta: number): void {
    const b = this.fight.boss;
    b.hp = Phaser.Math.Clamp(b.hp + delta, 1, b.mhp);
  }

  private draw(): void {
    const f = this.fight;
    const g = this.gfx;
    if (!f.player || !f.boss) return;
    g.clear();
    // hurtbox del player (verde), hitbox del colpo (giallo), hurtbox boss (rosso)
    const pr = f.player.rect();
    g.lineStyle(1, 0x40ff70, 0.9).strokeRect(pr.x, pr.y, pr.width, pr.height);
    const ab = f.player.attackBox();
    if (ab)
      g.lineStyle(1, 0xffe060, 0.9).strokeRect(ab.rect.x, ab.rect.y, ab.rect.width, ab.rect.height);
    const br = f.boss.rect();
    g.lineStyle(1, 0xff5060, 0.9).strokeRect(br.x, br.y, br.width, br.height);
    g.lineStyle(1, 0xffffff, 0.2).lineBetween(0, GROUND, 960, GROUND);

    const fps = Math.round(f.game.loop.actualFps);
    const p = f.player;
    const b = f.boss;
    this.text.setText(
      [
        `FPS ${fps}  ·  F2/F3/F4 boss  ·  F6/F7 ∓hp boss  ·  F8 kill  ·  F9 heal`,
        `player  ${p.state} ${Math.round(p.timeInState)}ms  hp ${p.hp.toFixed(0)}/${p.mhp}  st ${p.stamina.value.toFixed(0)}  inv ${Math.max(0, p.inv).toFixed(0)}  iframe ${p.invuln() ? 'SÌ' : 'no'}`,
        `boss    ${b.id} ${b.state} ${Math.round(b.aT)}ms  hp ${b.hp.toFixed(0)}/${b.mhp}  sp ${b.sp}  cool ${Math.max(0, b.cool).toFixed(0)}`,
      ].join('\n'),
    );
  }

  destroy(): void {
    for (const k of this.keys) this.fight.input.keyboard?.off(k.key, k.fn);
    this.fight.events.off('postupdate', this.draw, this);
    this.gfx.destroy();
    this.text.destroy();
  }
}
