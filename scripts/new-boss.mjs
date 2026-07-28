import { names, insertAtMarker, extendUnion, replaceOnce, writeNew } from './scaffold-utils.mjs';

/**
 * npm run new:boss -- nome-boss
 * Genera: dati (data/bosses.ts), entità, registrazione in BOSS_MAKERS,
 * texture placeholder nel manifest, testi stub, test di base.
 */
const { kebab, pascal, camel, upper } = names(process.argv[2]);

extendUnion('src/data/bosses.ts', '@scaffold:boss-id', camel);

insertAtMarker(
  'src/data/bosses.ts',
  '// @scaffold:boss-data',
  `/* ---- ${upper} (nuovo boss, generato da new:boss) ---- */
export interface ${pascal}Data extends BossCommonData {
  readonly strike: {
    readonly windupMs: number;
    readonly hit: CircleHit;
    readonly recoverMs: number;
    readonly cooldownMs: number;
  };
}

export const ${upper}: ${pascal}Data = {
  id: '${camel}',
  hp: 300, // TODO: bilanciare
  spawnX: 720,
  textureKey: '${camel}',
  textureH: 120,
  glowTint: 0xff5a1e,
  hurtbox: { w: 60, h: 100 },
  phase2: { hpThreshold: 150, comparison: 'lt', speedMult: 0.75 },
  idle: { moveSpeed: 80 },
  strike: {
    windupMs: 600,
    hit: { radius: 100, damage: 15, knockback: 220, offsetY: -10 },
    recoverMs: 300,
    cooldownMs: 1200,
  },
};

`,
);

insertAtMarker(
  'src/data/bosses.ts',
  '// @scaffold:boss-list',
  `${upper},
  `,
);

writeNew(
  `src/entities/bosses/${pascal}.ts`,
  `import type Phaser from 'phaser';
import { GROUND } from '../../config/game.config';
import { ${upper} } from '../../data/bosses';
import { puff } from '../../fx/particles';
import { beep } from '../../fx/audio';
import { BossBase, type BossHost } from './BossBase';

type ${pascal}State = 'idle' | 'strike';

/** Nuovo boss generato da new:boss: parti da qui. */
export class ${pascal} extends BossBase<${pascal}State> {
  private readonly d = ${upper};

  constructor(scene: Phaser.Scene, host: BossHost) {
    super(scene, host, ${upper}, 'idle');
  }

  update(dt: number): void {
    const d = this.d;
    const sp = this.sp;
    this.tick(dt);
    const px = this.px;
    this.setGlow(false, d.glowTint);

    if (this.state === 'idle') {
      this.face = px < this.x ? -1 : 1;
      this.x += (this.face * d.idle.moveSpeed * dt) / 1000;
      this.cool -= dt;
      if (this.cool <= 0) this.begin('strike');
    } else if (this.state === 'strike') {
      const wu = d.strike.windupMs * sp;
      if (this.aT < wu) this.setGlow(true, d.glowTint);
      if (!this.hitDone && this.aT >= wu) {
        this.hitDone = true;
        this.host.circHit(
          this.x,
          GROUND + (d.strike.hit.offsetY ?? 0),
          d.strike.hit.radius,
          d.strike.hit.damage,
          (px < this.x ? -1 : 1) * d.strike.hit.knockback,
        );
        puff(this.scene, this.x, GROUND - 40, 0xffb347, 14, 70, 400);
        beep(120, 0.3, 'square', 0.06, -50);
      }
      if (this.aT >= wu + d.strike.recoverMs) {
        this.begin('idle');
        this.cool = d.strike.cooldownMs * sp;
      }
    }
    this.postUpdate(dt);
  }
}
`,
);

insertAtMarker(
  'src/entities/bosses/index.ts',
  '// @scaffold:boss-maker — new:boss inserisce qui',
  `(scene, host) => new ${pascal}(scene, host),
  `,
);
replaceOnce(
  'src/entities/bosses/index.ts',
  "import { Palladio } from './Palladio';",
  `import { Palladio } from './Palladio';\nimport { ${pascal} } from './${pascal}';`,
);

writeNew(
  `src/art/generated/${camel}.ts`,
  `import type Phaser from 'phaser';

/** Placeholder procedurale di ${upper} (sostituiscilo con assets/${camel}.png). */
export function ${camel}(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x5a3a4a, 1);
  g.fillRect(20, 20, 40, 100);
  g.fillStyle(0xff5a2a, 1);
  g.fillCircle(32, 36, 4);
  g.fillCircle(48, 36, 4);
}
`,
);

insertAtMarker(
  'src/art/registry.ts',
  '// @scaffold:texture',
  `${camel}: { size: [80, 120], origin: [0.5, 1], generator: ${camel} },
  `,
);
replaceOnce(
  'src/art/registry.ts',
  "import { spear, brazier } from './generated/props';",
  `import { spear, brazier } from './generated/props';\nimport { ${camel} } from './generated/${camel}';`,
);

insertAtMarker(
  'src/data/strings.it.ts',
  '// @scaffold:boss-strings',
  `${camel}: { name: '${upper.replace(/_/g, ' ')}', sub: 'TODO: sottotitolo' },
    `,
);

writeNew(
  `tests/boss-${kebab}.test.ts`,
  `import { describe, expect, it } from 'vitest';
import { ${upper} } from '../src/data/bosses';
import { BOSSES } from '../src/data/bosses';
import { STRINGS_IT } from '../src/data/strings.it';

describe('${upper} (generato da new:boss)', () => {
  it('è registrato con dati validi', () => {
    expect(BOSSES).toContain(${upper});
    expect(${upper}.hp).toBeGreaterThan(0);
    expect(${upper}.phase2.speedMult).toBeGreaterThan(0);
    expect(${upper}.phase2.speedMult).toBeLessThanOrEqual(1);
  });

  it('ha i testi nel bundle', () => {
    expect(STRINGS_IT.bosses['${camel}'].name.length).toBeGreaterThan(0);
  });
});
`,
);

console.log(`
Boss "${kebab}" generato. Passi successivi:
  1. definisci i pattern in src/data/bosses.ts (${upper}) e la logica in src/entities/bosses/${pascal}.ts
  2. testo del sottotitolo in src/data/strings.it.ts
  3. se allunga la run: aggiungi arena e reliquia in strings.it.ts (arenas/relics) e data/relics.ts
  4. npm run art:preview per vedere il placeholder; assets/${camel}.png lo sostituirà
  5. npm run lint && npm run typecheck && npm run test
`);
