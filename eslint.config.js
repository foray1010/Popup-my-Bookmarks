import {
  eslintIgnoresConfig,
  eslintNodeConfig,
  eslintReactConfig,
} from '@foray1010/eslint-config'
import eslintPluginTanstackQuery from '@tanstack/eslint-plugin-query'
// eslint-disable-next-line import-x/extensions
import { defineConfig, globalIgnores } from 'eslint/config'

const reactFiles = ['__mocks__/**', 'src/**']

const testFiles = [
  '**/__mocks__/**/*.{cjs,cts,js,mjs,mts,ts,tsx}',
  '**/__tests__/**/*.{cjs,cts,js,mjs,mts,ts,tsx}',
  '**/*.{spec,test}.{cjs,cts,js,mjs,mts,ts,tsx}',
]

const config = defineConfig(
  eslintIgnoresConfig,
  globalIgnores(['**/*.css.d.ts']),
  {
    ignores: reactFiles,
    extends: [eslintNodeConfig],
  },
  {
    files: reactFiles,
    extends: [
      eslintReactConfig,
      eslintPluginTanstackQuery.configs['flat/recommended'],
    ],
    rules: {
      // https://github.com/import-js/eslint-plugin-import/issues/1739
      'import-x/no-unresolved': ['error', { ignore: [String.raw`\?`] }],
    },
  },
  {
    files: testFiles,
    settings: {
      // `eslint-plugin-jest` (from `@foray1010/eslint-config`) auto-detects the
      // installed `jest` version, but we run tests with the Jest-compatible
      // Rstest instead, so the version must be set explicitly.
      jest: {
        version: 30,
      },
    },
    languageOptions: {
      globals: {
        // Rstest exposes its utility namespace globally via `globals: true`
        rs: 'readonly',
      },
    },
  },
)
export default config
