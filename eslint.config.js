import {
  eslintIgnoresConfig,
  eslintNodeConfig,
  eslintReactConfig,
} from '@foray1010/eslint-config'
import eslintPluginTanstackQuery from '@tanstack/eslint-plugin-query'
// eslint-disable-next-line import-x/extensions
import { defineConfig, globalIgnores } from 'eslint/config'

const reactFiles = ['__mocks__/**', 'src/**']

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
)
export default config
