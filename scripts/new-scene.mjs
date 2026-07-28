import { names, insertAtMarker, writeNew } from './scaffold-utils.mjs';

/**
 * npm run new:scene -- nome-scena
 * Genera src/scenes/<Nome>Scene.ts e la registra in main.ts.
 */
const { kebab, pascal, camel } = names(process.argv[2]);

writeNew(
  `src/scenes/${pascal}Scene.ts`,
  `import Phaser from 'phaser';
import { H, MENU_BG_COLOR, W } from '../config/game.config';
import { T } from '../ui/text';

/** Scena generata da new:scene: parti da qui. */
export class ${pascal}Scene extends Phaser.Scene {
  constructor() {
    super('${camel}');
  }

  create(): void {
    this.cameras.main.setBackgroundColor(MENU_BG_COLOR);
    T(this, W / 2, H / 2, '${pascal}', 30, '#c9a227');
  }
}
`,
);

insertAtMarker(
  'src/main.ts',
  '// @scaffold:scene-import',
  `import { ${pascal}Scene } from './scenes/${pascal}Scene';\n`,
);
insertAtMarker(
  'src/main.ts',
  '// @scaffold:scene-list',
  `${pascal}Scene,
    `,
);

console.log(`Scena "${kebab}" registrata con chiave '${camel}': this.scene.start('${camel}').`);
