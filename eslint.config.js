import {
  applyConfig,
  eslintIgnoresConfig,
  eslintNodeConfig,
  eslintReactConfig,
} from '@foray1010/eslint-config'
import * as eslintPluginTanstackQuery from '@tanstack/eslint-plugin-query'

const reactDirs = ['__mocks__', 'src']

const config = [
  ...eslintIgnoresConfig,
  {
    ignores: ['**/*.css.d.ts'],
  },
  ...applyConfig(
    {
      filePrefixes: '.',
      ignores: reactDirs.map((dir) => `${dir}/**`),
    },
    eslintNodeConfig,
  ),
  ...applyConfig(
    {
      filePrefixes: reactDirs,
    },
    [
      ...eslintReactConfig,
      {
        plugins: {
          '@tanstack/query': eslintPluginTanstackQuery,
        },
        rules: {
          ...eslintPluginTanstackQuery.configs.recommended.rules,
          // https://github.com/import-js/eslint-plugin-import/issues/1739
          'import/no-unresolved': ['error', { ignore: ['\\?'] }],
        },
      },
    ],
  ),
  {
    rules: {
      // Bug: `RangeError: Maximum call stack size exceeded`
      'functional/prefer-immutable-types': 'off',
      'functional/type-declaration-immutability': 'off',
    },
  },
]
export default config
