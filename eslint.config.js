// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/', 'legacy/', 'assets/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // gli script di scaffolding girano in Node
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: { console: 'readonly', process: 'readonly', URL: 'readonly' },
    },
  },
  {
    rules: {
      // niente `any`, nemmeno espliciti: la specifica chiede strict vero
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  prettier,
);
