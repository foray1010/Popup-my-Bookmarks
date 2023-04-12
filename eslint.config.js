import {
  applyConfig,
  eslintIgnoresConfig,
  eslintNodeConfig,
  eslintReactConfig,
} from '@foray1010/eslint-config'

const reactDirs = ['__mocks__', 'src']

const config = [
  ...eslintIgnoresConfig,
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
        rules: {
          // https://github.com/import-js/eslint-plugin-import/issues/1739
          'import/no-unresolved': ['error', { ignore: ['\\?'] }],
        },
      },
    ],
  ),
]
export default config
