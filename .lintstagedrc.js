'use strict'

module.exports = {
  '*.{js,ts,tsx}': [
    'yarn prettier --write',
    'yarn eslint --fix',
    'jest --bail --findRelatedTests',
  ],
  '*.{json,yaml,yml}': 'yarn prettier --write',
  '*.css': ['yarn prettier --write', 'yarn stylelint --fix'],
  '*.md': (filenames) => {
    return [`yarn prettier --write ${filenames.join(' ')}`, 'yarn remark .']
  },
  '*ignore-sync': 'ignore-sync',
}
