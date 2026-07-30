import Phaser from 'phaser';
import { GROUND, H, W } from '../config/game.config';
import { ABILITIES, FIGHT } from '../config/balance';
import { LEVELS_PER_WORLD, levelSpec, roman } from '../data/worlds';
import { ITEMS, type ItemId } from '../data/items';
import { BUFFS, type BuffId } from '../data/buffs';
import { Urn } from '../entities/Urn';
import { SaveManager } from '../core/SaveManager';
import { strings } from '../data/i18n';
import { RUN } from '../core/RunState';
import { gameEvents } from '../core/EventBus';
import { InputManager } from '../input/InputManager';
import { KeyboardSource } from '../input/KeyboardSource';
import { VirtualPad } from '../input/VirtualPad';
import { GamepadSource } from '../input/GamepadSource';
import { MouseSource } from '../input/MouseSource';
import { useQuickItem } from '../core/quickItems';
import { Player, type CombatHost } from '../entities/Player';
import { Enemy, type EnemyHost } from '../entities/enemies/Enemy';
import { Pickup } from '../entities/Pickup';
import { Bolt } from '../entities/hazards/Bolt';
import { beep } from '../fx/audio';
import { puff, ringFx } from '../fx/particles';
import { shake } from '../fx/screenShake';
import { showDeathOverlay } from '../ui/deathOverlay';
import { T } from '../ui/text';
import { buildLevelBackground } from './levelBackground';
import type { WeaponId } from '../data/weapons';

/**
 * Livello intermedio: progressione orizzontale da sinistra a destra con
 * mini-nemici e pickup; il braciere finale ristora e apre il boss.
 */
export class LevelScene extends Phaser.Scene implements CombatHost, EnemyHost {
  over = false;
  player!: Player;
  boss = null; // l'HUD generico chiede un boss: qui non c'è

  private controls!: InputManager;
  private keyboardSource!: KeyboardSource;
  private enemies: Enemy[] = [];
  private pickups: Pickup[] = [];
  private bolts: Bolt[] = [];
  private urns: Urn[] = [];
  private world = 0;
  private levelIdx = 0;
  private isReplay = false;
  private brazierX = 0;
  private resting = false;
  private retryArmed = false;
  private restPrompt: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('level');
  }

  create(): void {
    this.over = false;
    this.resting = false;
    this.retryArmed = false;
    this.enemies = [];
    this.pickups = [];
    this.bolts = [];
    this.urns = [];
    // rigiocata di un cammino completato oppure progressione normale
    this.isReplay = RUN.replay !== null;
    this.world = RUN.replay?.world ?? RUN.bossIdx;
    this.levelIdx = RUN.replay?.level ?? RUN.levelIdx;
    const level = levelSpec(this.world, this.levelIdx);

    buildLevelBackground(this, level.arenaIdx, level.width);
    this.physics.world.setBounds(30, -400, level.width - 60, GROUND + 400);
    this.cameras.main.setBounds(0, 0, level.width, H);

    this.controls = new InputManager();
    this.keyboardSource = new KeyboardSource(this);
    this.controls.addSource(this.keyboardSource);
    this.controls.addSource(new VirtualPad(this));
    this.controls.addSource(new GamepadSource(this));
    this.controls.addSource(new MouseSource(this));
    const offSettings = gameEvents.on('settings:changed', () => this.keyboardSource.rebuild());
    this.events.once('shutdown', offSettings);

    this.player = new Player(this, this);
    this.cameras.main.startFollow(this.player.spr, true, 0.12, 0.12);

    for (const spawn of level.enemies)
      this.enemies.push(new Enemy(this, this, spawn.type, spawn.x));
    for (const it of level.items) this.pickups.push(new Pickup(this, 'item', it.id, it.x));
    // urne segrete: solo quelle non ancora raccolte in questo sigillo
    for (const u of level.urns)
      if (!RUN.hasSecret(u.uid)) this.urns.push(new Urn(this, u.x, u.content, u.uid));

    // braciere-checkpoint in fondo al cammino
    this.brazierX = level.width - 140;
    this.add.image(this.brazierX, GROUND, 'brazier').setOrigin(0.5, 1).setDepth(1);

    // HUD sopra il livello
    if (this.scene.isActive('hud') || this.scene.isSleeping('hud')) this.scene.stop('hud');
    this.scene.launch('hud', { target: 'level' });
    this.events.once('shutdown', () => this.scene.stop('hud'));

    // mondo e cammino correnti + meta (fissi sullo schermo, svaniscono)
    const s = strings();
    const label = T(
      this,
      W / 2,
      92,
      `${s.level.world} ${roman(this.world + 1)}  ·  ${s.level.path} ${roman(this.levelIdx + 1)}`,
      24,
      '#c9a227',
    )
      .setScrollFactor(0)
      .setDepth(11);
    const goal = T(this, W / 2, 126, s.level.goal, 17, '#d8c9a3')
      .setScrollFactor(0)
      .setDepth(11);
    this.tweens.add({ targets: [label, goal], alpha: 0, duration: 900, delay: 2400 });
    beep(60, 0.5, 'sine', 0.04, -10);
  }

  /* --- CombatHost --- */

  spawnBolt(x: number, y: number, vx: number): void {
    this.bolts.push(new Bolt(this, x, y, vx));
  }

  doSmite(p: Player): void {
    shake(this, ABILITIES.smite.shake.durationMs, ABILITIES.smite.shake.intensity);
    ringFx(this, p.spr.x, p.spr.y - 30, 0xffd76b, 4.4, 360);
    puff(this, p.spr.x, p.spr.y - 20, 0xffd76b, 24, 90, 480);
    beep(85, 0.5, 'square', 0.09, -40);
    for (const e of this.enemies)
      if (!e.dead && Math.abs(e.x - p.spr.x) < ABILITIES.smite.range)
        e.takeDamage(ABILITIES.smite.damage * p.mult);
  }

  onPlayerDeath(): void {
    this.over = true;
    showDeathOverlay(
      this,
      this.player.classIdx,
      () => this.scene.restart(),
      () => {
        this.retryArmed = true;
      },
    );
  }

  /* --- EnemyHost --- */

  onEnemyDeath(enemy: Enemy): void {
    if (Math.random() < enemy.data.dropChance)
      this.pickups.push(new Pickup(this, 'item', 'balsamo', enemy.x));
  }

  /* --- update --- */

  update(_time: number, dtRaw: number): void {
    const dt = Math.min(dtRaw, FIGHT.dtClampMs);
    this.controls.update();

    if (!this.over && this.controls.justPressed('PAUSE')) {
      this.scene.launch('pause', { target: 'level' });
      this.scene.pause();
      return;
    }
    if (!this.over && this.controls.justPressed('INVENTORY')) {
      this.scene.launch('inventory', { from: 'level' });
      this.scene.pause();
      return;
    }
    if (this.over && this.retryArmed && this.controls.justPressed('CONFIRM')) {
      this.scene.restart();
      return;
    }
    // oggetto rapido (rotella / F) e ciclo del tipo (C)
    if (!this.over && this.controls.justPressed('CYCLE_ITEM')) {
      RUN.cycleQuickItem();
      beep(300, 0.05, 'sine', 0.03, 60);
    }
    if (!this.over && this.controls.justPressed('QUICK_ITEM')) {
      if (useQuickItem(this.player)) {
        beep(880, 0.25, 'sine', 0.05, 120);
        puff(this, this.player.spr.x, this.player.spr.y - 40, 0x7fd8a8, 8, 40, 300);
        SaveManager.save();
      } else beep(120, 0.1, 'square', 0.03, -40);
    }

    if (Math.random() < 0.15)
      puff(this, this.cameras.main.scrollX + Math.random() * W, H - 10, 0xffaa5a, 1, 10, 1200);
    if (Math.random() < 0.3)
      puff(this, this.brazierX + (Math.random() * 26 - 13), GROUND - 34, 0xff9a3c, 1, 14, 600);

    if (!this.over && !this.resting) this.player.update(dt, this.controls);

    this.enemies = this.enemies.filter((e) => e.update(dt));

    // dardi della Vestale contro i nemici
    const alive = this.enemies.filter((e) => !e.dead);
    this.bolts = this.bolts.filter((b) =>
      b.update(dt, this, alive, (e) => e.takeDamage(ABILITIES.cast.boltDamage * this.player.mult)),
    );

    // colpi in mischia: urne segrete e nemici (un colpo, un bersaglio)
    const a = this.player.attackBox();
    if (a) {
      let hit = false;
      for (const u of this.urns) {
        if (!u.broken && Phaser.Geom.Rectangle.Overlaps(a.rect, u.rect())) {
          this.player.registerHit();
          if (u.smash())
            this.pickups.push(new Pickup(this, u.content.kind, u.content.id, u.x, u.uid));
          hit = true;
          break;
        }
      }
      if (!hit)
        for (const e of alive) {
          if (Phaser.Geom.Rectangle.Overlaps(a.rect, e.rect())) {
            this.player.registerHit();
            e.takeDamage(a.damage);
            puff(this, e.x, GROUND - 40, 0xffd27a, 10, 60, 320);
            beep(500, 0.06, 'square', 0.05, -300);
            break;
          }
        }
    }
    for (const u of this.urns) u.update(this.player.spr.x);

    // raccolta
    if (!this.over) {
      const pr = this.player.rect();
      this.pickups = this.pickups.filter((p) => {
        if (!Phaser.Geom.Rectangle.Overlaps(pr, p.rect())) return true;
        this.collect(p);
        p.destroy();
        return false;
      });
    }

    this.updateBrazier();
  }

  private collect(p: Pickup): void {
    const s = strings();
    let name: string;
    let fx: string;
    if (p.kind === 'weapon') {
      RUN.addWeapon(p.id as WeaponId);
      const entry = s.weapons[p.id as WeaponId];
      name = entry.name;
      fx = entry.fx;
    } else if (p.kind === 'buff') {
      RUN.addBuff(p.id as BuffId);
      const b = BUFFS[p.id as BuffId];
      const entry = s.buffs[b.id];
      name = entry.name;
      fx = entry.fx;
    } else {
      RUN.addItem(p.id as ItemId);
      const entry = s.items[ITEMS[p.id as ItemId].id];
      name = entry.name;
      fx = entry.fx;
    }
    if (p.secretUid) RUN.markSecret(p.secretUid);
    SaveManager.save();
    beep(660, 0.2, 'sine', 0.05, 160);
    ringFx(this, p.x, GROUND - 30, 0xffd27a, 2.4, 320);
    const toast = T(
      this,
      p.x,
      GROUND - 92,
      `${s.inventory.picked}  ·  ${name}`,
      15,
      '#ffd27a',
    ).setDepth(11);
    const toastFx = T(this, p.x, GROUND - 72, fx, 12, '#9fd0ea', {
      wordWrap: { width: 340 },
    }).setDepth(11);
    this.tweens.add({
      targets: [toast, toastFx],
      y: '-=30',
      alpha: 0,
      duration: 2200,
      ease: 'Sine.in',
      onComplete: () => {
        toast.destroy();
        toastFx.destroy();
      },
    });
  }

  private updateBrazier(): void {
    if (this.over || this.resting) return;
    const s = strings();
    const nextIsBoss = !this.isReplay && this.levelIdx >= LEVELS_PER_WORLD - 1;
    const near = Math.abs(this.player.spr.x - this.brazierX) < 70;
    if (near && !this.restPrompt) {
      this.restPrompt = T(
        this,
        W / 2,
        H - 100,
        nextIsBoss ? s.level.rest : s.level.restNext,
        16,
        '#d8c9a3',
      )
        .setScrollFactor(0)
        .setDepth(11);
    } else if (!near && this.restPrompt) {
      this.restPrompt.destroy();
      this.restPrompt = null;
    }
    if (near && this.controls.justPressed('CONFIRM')) {
      this.resting = true;
      // riposo al braciere: si riparte sempre a piena vita
      this.player.hp = this.player.mhp;
      this.player.stamina.value = this.player.stamina.max;
      this.player.fl = this.player.mfl;
      beep(300, 0.3, 'sine', 0.05, 150);
      ringFx(this, this.brazierX, GROUND - 30, 0xff9a3c, 3.2, 500);
      this.cameras.main.fadeOut(600, 0, 0, 0);
      this.time.delayedCall(650, () => {
        if (this.isReplay) {
          // rigiocata: si torna alla scelta dei cammini
          RUN.replay = null;
          this.scene.start('levelselect');
          return;
        }
        RUN.completeLevel(this.world, this.levelIdx);
        RUN.levelIdx++;
        SaveManager.save();
        this.scene.start(RUN.levelIdx < LEVELS_PER_WORLD ? 'level' : 'fight');
      });
    }
  }
}
