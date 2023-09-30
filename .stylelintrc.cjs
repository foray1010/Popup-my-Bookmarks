'use strict'

module.exports = {
  extends: ['@foray1010/stylelint-config'],
  rules: {
    'plugin/no-unsupported-browser-features': [
      true,
      {
        ignore: [
          // We are not using button with `display: contents`
          'css-display-contents',
          // Handled by lightningcss
          'css-nesting',
        ],
        severity: 'error',
      },
    ],
  },
}
