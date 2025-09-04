import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended', // TS-specific rules
      'plugin:node/recommended', // Node.js rules
      'prettier', // Disables conflicting formatting rules
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: globals.node },
    rules: {
      // General
      'no-console': 'warn',
      'no-unused-vars': 'off', // Disable core rule to avoid conflicts with TypeScript's no-unused-vars
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'no-duplicate-imports': 'error',

      // TypeScript
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',

      // Express-related (no specific plugin, but apply good practices)
      'callback-return': 'error', // Ensures you return after handling async callback errors
      'handle-callback-err': 'error',
    },
  },
  tseslint.configs.recommended,
]);
