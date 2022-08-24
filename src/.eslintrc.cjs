'use strict'

module.exports = {
  root: true,
  extends: ['@foray1010/eslint-config/react'],
  rules: {
    // https://github.com/import-js/eslint-plugin-import/issues/1739
    'import/no-unresolved': ['error', { ignore: ['\\?'] }],
  },
}
