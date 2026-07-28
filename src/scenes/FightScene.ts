import Phaser from 'phaser';
import { GROUND, H, PHYSICS_BOUNDS, W } from '../config/game.config';
import { ABILITIES, FIGHT } from '../config/balance';
import { strings } from '../data/i18n';
import { RUN } from '../core/RunState';
import { gameEvents } from '../core/EventBus';
import { InputManager } from '../input/InputManager';
import { KeyboardSource } from '../input/KeyboardSource';
import { VirtualPad } from '../input/VirtualPad';
import { GamepadSource } from '../input/GamepadSource';
import { IS_TOUCH } from '../input/device';
import { Player, type CombatHost } from '../entities/Player';
import { BossBase, type BossHost } from '../entities/bosses/BossBase';
import { BOSS_MAKERS } from '../entities/bosses';
import { Flame } from '../entities/hazards/Flame';
import { Spear } from '../entities/hazards/Spear';
import { Wave } from '../entities/hazards/Wave';
import { Bolt } from '../entities/hazards/Bolt';
import { circHitPlayer, rectHitPlayer } from '../entities/hitTests';
import { beep } from '../fx/audio';
import { puff, ringFx } from '../fx/particles';
import { shake } from '../fx/screenShake';
import { T } from '../ui/text';
import { buildArena } from './arena';

/** Scena di combattimento (port del legacy r. 782-905, senza l'HUD). */
export class FightScene extends Phaser.Scene implements CombatHost, BossHost {
  over = false;
  player!: Player;
  boss!: BossBase;
  fightTimeMs = 0;

  private winT = 0;
  private controls!: InputManager;
  private flames: Flame[] = [];
  private spears: Spear[] = [];
  private waves: Wave[] = [];
  private bolts: Bolt[] = [];
  private brazierXs: number[] | null = null;

  constructor() {
    super('fight');
  }

  create(): void {
    this.over = false;
    this.winT = 0;
    this.fightTimeMs = 0;
    this.flames = [];
    this.spears = [];
    this.waves = [];
    this.bolts = [];

    this.brazierXs = buildArena(this, RUN.bossIdx);
    this.physics.world.setBounds(
      PHYSICS_BOUNDS.x,
      PHYSICS_BOUNDS.y,
      PHYSICS_BOUNDS.width,
      PHYSICS_BOUNDS.height,
    );

    this.controls = new InputManager();
    this.controls.addSource(new KeyboardSource(this));
    this.controls.addSource(new VirtualPad(this));
    this.controls.addSource(new GamepadSource(this));

    this.player = new Player(this, this);
    const maker = BOSS_MAKERS[RUN.bossIdx];
    if (!maker) throw new Error(`Boss inesistente: ${RUN.bossIdx}`);
    this.boss = maker(this, this);

    // HUD come scena separata sopra questa: la si ricrea a ogni fight
    // e la si spegne quando la fight finisce (interludio, retry, titolo)
    if (this.scene.isActive('hud') || this.scene.isSleeping('hud')) this.scene.stop('hud');
    this.scene.launch('hud');
    this.events.once('shutdown', () => this.scene.stop('hud'));

    const bs = strings().bosses[this.boss.id];
    this.banner(bs.name, bs.sub);
    beep(60, 0.6, 'sine', 0.05, -20);
  }

  banner(a: string, b: string): void {
    const bg = this.add
      .rectangle(W / 2, H / 2 - 16, W, 112, 0x000000, 0.35)
      .setDepth(11)
      .setAlpha(0);
    const t1 = T(this, W / 2, H / 2 - 30, a, 42, '#c9a227')
      .setDepth(11)
      .setAlpha(0);
    const t2 = b
      ? T(this, W / 2, H / 2 + 8, b, 17, '#8d7c5c')
          .setDepth(11)
          .setAlpha(0)
      : null;
    const all = [bg, t1, t2].filter(Boolean) as Phaser.GameObjects.GameObject[];
    this.tweens.add({
      targets: all,
      alpha: 1,
      duration: 300,
      hold: 1400,
      yoyo: true,
      onComplete: () => all.forEach((o) => o.destroy()),
    });
  }

  /* --- BossHost / CombatHost --- */

  circHit(x: number, y: number, r: number, dmg: number, kb: number): void {
    circHitPlayer(this.player, this.over, x, y, r, dmg, kb);
  }

  rectHit(rx: number, ry: number, rw: number, rh: number, dmg: number, kb: number): void {
    rectHitPlayer(this.player, this.over, rx, ry, rw, rh, dmg, kb);
  }

  addFlame(x: number): void {
    this.flames.push(new Flame(this, x));
  }

  addSpear(x: number, y: number, vx: number): void {
    this.spears.push(new Spear(this, x, y, vx));
  }

  addWave(x: number, vx: number): void {
    this.waves.push(new Wave(this, x, vx));
  }

  spawnBolt(x: number, y: number, vx: number): void {
    this.bolts.push(new Bolt(this, x, y, vx));
  }

  doSmite(p: Player): void {
    shake(this, ABILITIES.smite.shake.durationMs, ABILITIES.smite.shake.intensity);
    ringFx(this, p.spr.x, p.spr.y - 30, 0xffd76b, 4.4, 360);
    puff(this, p.spr.x, p.spr.y - 20, 0xffd76b, 24, 90, 480);
    beep(85, 0.5, 'square', 0.09, -40);
    if (this.boss && Math.abs(this.boss.x - p.spr.x) < ABILITIES.smite.range)
      this.dmgBoss(ABILITIES.smite.damage * p.mult);
  }

  dmgBoss(d: number): void {
    const b = this.boss;
    if (!b || b.dead || this.over) return;
    b.hp -= d;
    b.flash();
    gameEvents.emit('boss:hurt', { hp: b.hp, maxHp: b.mhp });
    if (b.hp <= 0) {
      b.hp = 0;
      b.dead = true;
      b.deadT = 0;
      b.clearMarks();
      RUN.grantRelic(RUN.bossIdx);
      RUN.recordTime(RUN.bossIdx, this.fightTimeMs);
      gameEvents.emit('relic:gained', { relicIdx: RUN.bossIdx });
      gameEvents.emit('boss:death', { bossIdx: RUN.bossIdx, fightTimeMs: this.fightTimeMs });
      this.banner(strings().fight.bossDown, '');
      beep(90, 1, 'sawtooth', 0.08, -50);
    }
  }

  onPlayerDeath(): void {
    this.over = true;
    beep(60, 0.8, 'sawtooth', 0.07, -30);
    const dark = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0).setDepth(12);
    this.tweens.add({ targets: dark, fillAlpha: 0.75, duration: 900 });
    // l'HUD è una scena sopra: si attenua come farebbe sotto il velo nero
    const hud = this.scene.get('hud') as { dim?: (a: number, d: number) => void };
    hud.dim?.(0.25, 900);
    const deathText = strings().classes[this.player.classIdx]?.death ?? '';
    const t = T(this, W / 2, H / 2, deathText, 52, '#8e2f2f')
      .setDepth(13)
      .setAlpha(0);
    this.tweens.add({ targets: t, alpha: 1, duration: 700, delay: 500 });
    this.time.delayedCall(1200, () => {
      const s = strings();
      T(
        this,
        W / 2,
        H / 2 + 48,
        IS_TOUCH ? s.fight.retryTouch : s.fight.retryKey,
        15,
        '#8d7c5c',
      ).setDepth(13);
      const again = (): void => {
        this.scene.restart();
      };
      this.input.keyboard?.once('keydown-ENTER', again);
      this.input.keyboard?.once('keydown-R', again);
      this.input.once('pointerdown', again);
    });
  }

  update(_time: number, dtRaw: number): void {
    const dt = Math.min(dtRaw, FIGHT.dtClampMs);
    this.controls.update();

    // braci ambientali (r. 858-861)
    if (Math.random() < 0.2) puff(this, Math.random() * W, H - 10, 0xffaa5a, 1, 10, 1200);
    if (this.brazierXs && Math.random() < 0.35)
      this.brazierXs.forEach((x) => {
        if (Math.random() < 0.5)
          puff(this, x + (Math.random() * 26 - 13), GROUND - 34, 0xff9a3c, 1, 14, 600);
      });

    if (!this.over) this.player.update(dt, this.controls);
    const b = this.boss;
    if (!this.over && !b.dead) this.fightTimeMs += dt;

    if (b.dead) {
      b.deadT += dt;
      b.node.setAlpha(Math.max(0, 1 - b.deadT / FIGHT.bossDeathFadeMs));
      if (Math.random() < 0.5)
        puff(
          this,
          b.x + (Math.random() * 80 - 40),
          GROUND - 40 - Math.random() * 60,
          0xffb347,
          2,
          50,
          500,
        );
      if (b.deadT > FIGHT.bossDeathToInterludeMs && !this.winT) {
        this.winT = 1;
        this.scene.start('inter');
        return;
      }
    } else if (!this.over) b.update(dt);

    this.flames = this.flames.filter((f) => f.update(dt, this, this.player, this.over));
    this.spears = this.spears.filter((s) => s.update(dt, this.player, this.over));
    this.waves = this.waves.filter((w) => w.update(dt, this, this.player, this.over));
    this.bolts = this.bolts.filter((p) =>
      p.update(dt, this, b, this.player.mult, (dmg) => this.dmgBoss(dmg)),
    );

    // colpi in mischia (r. 897-903)
    const a = this.player.attackBox();
    if (a && b && !b.dead && Phaser.Geom.Rectangle.Overlaps(a.rect, b.rect())) {
      this.player.registerHit();
      this.dmgBoss(a.damage);
      puff(
        this,
        this.player.spr.x + this.player.face * 50,
        this.player.spr.y - 50,
        0xffd27a,
        10,
        60,
        320,
      );
      beep(500, 0.06, 'square', 0.05, -300);
    }
  }
}
