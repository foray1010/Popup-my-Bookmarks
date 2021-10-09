'use strict'

module.exports = {
  '*.{cjs,cts,js,mjs,mts,ts,tsx}': [
    'yarn prettier --write',
    'yarn eslint --fix',
    'yarn test --findRelatedTests',
  ],
  '*.css': ['yarn prettier --write', 'yarn stylelint --fix'],
  '*.{json,yaml,yml}': 'yarn prettier --write',
  '*.{markdown,md}'(filenames) {
    return [`yarn prettier --write ${filenames.join(' ')}`, 'yarn remark .']
  },
  '*ignore-sync': 'ignore-sync',
}
