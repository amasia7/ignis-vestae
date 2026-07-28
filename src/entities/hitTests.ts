import Phaser from 'phaser';
import type { Player } from './Player';

/**
 * Ferite alla giocatrice: port di circHit/rectHit del legacy (r. 810-814).
 * Il punto di prova del cerchio è (x, y-32) del player, come nel legacy.
 */
export function circHitPlayer(
  player: Player,
  over: boolean,
  x: number,
  y: number,
  r: number,
  damage: number,
  knockbackX: number,
): void {
  if (over) return;
  const px = player.spr.x;
  const py = player.spr.y - 32;
  if ((px - x) * (px - x) + (py - y) * (py - y) < r * r) player.hurt(damage, knockbackX);
}

export function rectHitPlayer(
  player: Player,
  over: boolean,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
  damage: number,
  knockbackX: number,
): void {
  if (over) return;
  if (Phaser.Geom.Rectangle.Overlaps(player.rect(), new Phaser.Geom.Rectangle(rx, ry, rw, rh)))
    player.hurt(damage, knockbackX);
}
