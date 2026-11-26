import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default defineConfig([
  { ignores: ['dist', 'coverage', 'node_modules', 'test-results', 'playwright-report'] },
  {
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
  },
  {
    // Ficheiros de teste e configuração: Node + Vitest
    files: ['**/*.test.{ts,tsx}', 'src/test-setup.ts', 'vitest.config.ts', 'vite.config.ts'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
])
