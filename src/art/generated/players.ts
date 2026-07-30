import type Phaser from 'phaser';

/**
 * Le tre classi in pixel-art «chunky», nello stile degli asset di
 * riferimento del committente (guerriero, arciere, aquila): griglia di
 * celle 2×2, contorno scuro attorno alla silhouette, colori pieni.
 * 44×70, piedi appoggiati a y=70, rivolti a destra.
 */

/** Una cella: [colonna, riga, larghezza, altezza, colore] su griglia 2px. */
type Px = readonly [number, number, number, number, number];

const S = 2; // lato della cella in px
const OUTLINE = 0x14100c;

/**
 * Disegna la figura: prima la silhouette spostata nelle 4 direzioni
 * (il contorno), poi le celle colorate, poi i dettagli senza contorno.
 */
function draw(g: Phaser.GameObjects.Graphics, body: readonly Px[], detail: readonly Px[]): void {
  g.fillStyle(OUTLINE, 1);
  for (const [c, r, w, h] of body)
    for (const [dc, dr] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const)
      g.fillRect((c + dc) * S, (r + dr) * S, w * S, h * S);
  for (const [c, r, w, h, col] of body) {
    g.fillStyle(col, 1);
    g.fillRect(c * S, r * S, w * S, h * S);
  }
  for (const [c, r, w, h, col] of detail) {
    g.fillStyle(col, 1);
    g.fillRect(c * S, r * S, w * S, h * S);
  }
}

/** pl0 — Vestale: veste avorio, velo, sciarpa rossa che fluttua. */
export function vestale(g: Phaser.GameObjects.Graphics): void {
  const robe = 0xe9e2d0;
  const shade = 0xcfc4a8;
  const red = 0xa4302a;
  const gold = 0xc9a227;
  const skin = 0xe8c8a0;
  draw(
    g,
    [
      [8, 1, 7, 3, robe], // velo, calotta
      [8, 4, 1, 5, robe], // velo, lato dietro
      [14, 4, 1, 6, robe], // velo, drappo davanti
      [9, 4, 5, 4, skin], // volto
      [8, 8, 7, 2, red], // sciarpa al collo
      [5, 9, 3, 2, red], // sciarpa, lembo
      [3, 11, 3, 2, red], // sciarpa, coda al vento
      [7, 10, 8, 9, robe], // busto
      [14, 10, 2, 7, robe], // braccio avanti
      [6, 19, 10, 9, robe], // gonna
      [5, 28, 12, 4, robe], // gonna, svaso
      [8, 32, 3, 3, 0x4a3a2c], // piede dietro
      [12, 32, 3, 3, 0x4a3a2c], // piede avanti
    ],
    [
      [8, 3, 7, 1, red], // bordo rosso del velo
      [12, 5, 1, 1, OUTLINE], // occhio
      [7, 13, 8, 1, gold], // fascia dorata
      [7, 16, 8, 1, red], // fascia rossa
      [14, 16, 2, 2, skin], // mano
      [6, 26, 10, 1, shade], // piega della gonna
      [5, 31, 12, 1, red], // orlo rosso
    ],
  );
}

/** pl1 — Sacerdote Rinnegato: veste scura, spallaccio, barba. */
export function sacerdote(g: Phaser.GameObjects.Graphics): void {
  const robe = 0x5a5148;
  const shade = 0x453e37;
  const gold = 0xc9a227;
  const skin = 0xd8b088;
  const bronze = 0x8a7458;
  draw(
    g,
    [
      [8, 1, 7, 4, robe], // cappuccio
      [9, 5, 5, 4, skin], // volto
      [6, 10, 10, 9, robe], // busto largo
      [13, 9, 4, 3, bronze], // spallaccio
      [15, 11, 2, 6, robe], // braccio avanti
      [6, 19, 10, 9, robe], // gonna
      [5, 28, 13, 4, robe], // gonna, svaso
      [8, 32, 3, 3, 0x2c2620], // piede dietro
      [13, 32, 3, 3, 0x2c2620], // piede avanti
    ],
    [
      [12, 6, 1, 1, OUTLINE], // occhio
      [9, 8, 5, 1, 0x3a332c], // barba
      [14, 10, 2, 1, gold], // borchia dello spallaccio
      [6, 13, 10, 1, gold], // fascia dorata
      [6, 17, 10, 1, 0x2c2620], // cintura
      [15, 17, 2, 2, skin], // mano
      [6, 26, 10, 1, shade], // piega della gonna
      [5, 31, 13, 1, gold], // orlo dorato
    ],
  );
}

/** pl2 — Aruspice: figura esile, cappuccio a punta, veste chiara. */
export function aruspice(g: Phaser.GameObjects.Graphics): void {
  const robe = 0xd8dde5;
  const shade = 0xb8c0cc;
  const blue = 0x4a6fa0;
  const skin = 0xe8d8c0;
  draw(
    g,
    [
      [10, 0, 3, 2, robe], // punta del cappuccio
      [9, 2, 6, 3, robe], // cappuccio
      [9, 5, 5, 4, skin], // volto
      [7, 10, 7, 9, robe], // busto esile
      [13, 10, 2, 7, robe], // braccio avanti
      [7, 19, 8, 9, robe], // gonna
      [6, 28, 10, 4, robe], // gonna, svaso
      [8, 32, 2, 3, 0x3a4150], // piede dietro
      [12, 32, 2, 3, 0x3a4150], // piede avanti
    ],
    [
      [12, 6, 1, 1, OUTLINE], // occhio
      [7, 13, 7, 1, blue], // fascia blu
      [7, 16, 7, 1, blue], // seconda fascia
      [13, 16, 2, 2, skin], // mano
      [7, 26, 8, 1, shade], // piega della gonna
      [6, 31, 10, 1, blue], // orlo blu
    ],
  );
}
