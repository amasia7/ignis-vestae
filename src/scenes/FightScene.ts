import Phaser from 'phaser';
import { GROUND, H, PHYSICS_BOUNDS, W } from '../config/game.config';
import { ABILITIES, FIGHT } from '../config/balance';
import { strings } from '../data/i18n';
import { RUN } from '../core/RunState';
import { BOSS_DROPS } from '../data/buffs';
import type { WeaponId } from '../data/weapons';
import { SaveManager } from '../core/SaveManager';
import { gameEvents } from '../core/EventBus';
import { InputManager } from '../input/InputManager';
import { KeyboardSource } from '../input/KeyboardSource';
import { VirtualPad } from '../input/VirtualPad';
import { GamepadSource } from '../input/GamepadSource';
import { Player, type CombatHost } from '../entities/Player';
import { BossBase, type BossHost } from '../entities/bosses/BossBase';
import { BOSS_MAKERS } from '../entities/bosses';
import { Flame } from '../entities/hazards/Flame';
import { Spear } from '../entities/hazards/Spear';
import { Wave } from '../entities/hazards/Wave';
import { Bolt } from '../entities/hazards/Bolt';
import { circHitPlayer, rectHitPlayer } from '../entities/hitTests';
import { showDeathOverlay } from '../ui/deathOverlay';
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
  private keyboardSource!: KeyboardSource;
  private retryArmed = false;
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
    this.keyboardSource = new KeyboardSource(this);
    this.controls.addSource(this.keyboardSource);
    this.controls.addSource(new VirtualPad(this));
    this.controls.addSource(new GamepadSource(this));

    // rimappature fatte dalle impostazioni in pausa: ricostruisci i tasti
    const offSettings = gameEvents.on('settings:changed', () => this.keyboardSource.rebuild());
    this.events.once('shutdown', offSettings);

    // debug overlay solo in dev: il modulo non entra nella build di produzione
    if (import.meta.env.DEV) {
      this.input.keyboard?.on('keydown-F1', () => {
        void import('../debug/DebugOverlay').then((m) => m.toggleDebugOverlay(this));
      });
    }

    this.player = new Player(this, this);
    const maker = BOSS_MAKERS[RUN.bossIdx];
    if (!maker) throw new Error(`Boss inesistente: ${RUN.bossIdx}`);
    this.boss = maker(this, this);

    // HUD come scena separata sopra questa: la si ricrea a ogni fight
    // e la si spegne quando la fight finisce (interludio, retry, titolo)
    if (this.scene.isActive('hud') || this.scene.isSleeping('hud')) this.scene.stop('hud');
    // target SEMPRE esplicito: senza data Phaser riusa quelli del lancio
    // precedente (era il bug delle barre congelate dopo un livello)
    this.scene.launch('hud', { target: 'fight' });
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
      // bottino del custode: un'arma o una benedizione permanente
      const drop = BOSS_DROPS[RUN.bossIdx];
      if (drop) {
        if (drop.kind === 'weapon') RUN.addWeapon(drop.id as WeaponId);
        else RUN.addBuff(drop.id);
      }
      SaveManager.save();
      gameEvents.emit('relic:gained', { relicIdx: RUN.bossIdx });
      gameEvents.emit('boss:death', { bossIdx: RUN.bossIdx, fightTimeMs: this.fightTimeMs });
      this.banner(strings().fight.bossDown, '');
      beep(90, 1, 'sawtooth', 0.08, -50);
    }
  }

  onPlayerDeath(): void {
    this.over = true;
    this.retryArmed = false;
    showDeathOverlay(
      this,
      this.player.classIdx,
      () => this.scene.restart(),
      () => {
        this.retryArmed = true; // abilita anche il retry da gamepad (CONFIRM)
      },
    );
  }

  update(_time: number, dtRaw: number): void {
    const dt = Math.min(dtRaw, FIGHT.dtClampMs);
    this.controls.update();

    // pausa con ESC o Start del gamepad (novità Fase 8)
    if (!this.over && this.controls.justPressed('PAUSE')) {
      this.scene.launch('pause', { target: 'fight' });
      this.scene.pause();
      return;
    }
    // borsa con I (o Select del gamepad)
    if (!this.over && this.controls.justPressed('INVENTORY')) {
      this.scene.launch('inventory', { from: 'fight' });
      this.scene.pause();
      return;
    }
    // retry da gamepad dopo la morte
    if (this.over && this.retryArmed && this.controls.justPressed('CONFIRM')) {
      this.scene.restart();
      return;
    }

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
      p.update(dt, this, b.dead ? [] : [b], () =>
        this.dmgBoss(ABILITIES.cast.boltDamage * this.player.mult),
      ),
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
