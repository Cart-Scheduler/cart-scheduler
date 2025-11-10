import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';

const SRC_FILES = ['**/*.{js,mjs,cjs,jsx}'];

export default defineConfig([
  { files: SRC_FILES, plugins: { js }, extends: ['js/recommended'] },
  { files: SRC_FILES, languageOptions: { globals: globals.browser } },
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'react/prop-types': 'off',
    },
  },
  prettier, // this must be last
]);
