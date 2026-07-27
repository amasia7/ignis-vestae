import { defineConfig } from 'vitest/config';

export default defineConfig({
  // base relativo: la build funziona sia su GitHub Pages sia su itch.io
  base: './',
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
  },
  server: {
    port: 5173,
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
