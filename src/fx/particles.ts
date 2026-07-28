import type Phaser from 'phaser';

/** Sbuffo di particelle (port esatto del legacy r. 187-196). */
export function puff(
  scene: Phaser.Scene,
  x: number,
  y: number,
  tint: number,
  n: number,
  spread: number,
  dur: number,
): void {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.283;
    const s = 20 + Math.random() * spread;
    const p = scene.add
      .image(x, y, 'dot')
      .setTint(tint)
      .setDepth(6)
      .setScale(0.4 + Math.random() * 0.8)
      .setAlpha(0.9);
    scene.tweens.add({
      targets: p,
      x: x + Math.cos(a) * s,
      y: y + Math.sin(a) * s - 14,
      alpha: 0,
      scale: 0.1,
      duration: dur * (0.6 + Math.random() * 0.7),
      onComplete: () => p.destroy(),
    });
  }
}

/** Anello in espansione (port esatto del legacy r. 197-200). */
export function ringFx(
  scene: Phaser.Scene,
  x: number,
  y: number,
  tint: number,
  scale: number,
  dur: number,
): void {
  const r = scene.add.image(x, y, 'ring').setTint(tint).setDepth(6).setScale(0.2);
  scene.tweens.add({
    targets: r,
    scale,
    alpha: 0,
    duration: dur,
    onComplete: () => r.destroy(),
  });
}
