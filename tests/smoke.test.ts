import { describe, expect, it } from 'vitest';

// Test di fumo della Fase 1: verifica che la toolchain Vitest funzioni.
// I test reali sulla logica pura arrivano dalla Fase 2 in poi.
describe('toolchain', () => {
  it('esegue i test', () => {
    expect(1 + 1).toBe(2);
  });
});
