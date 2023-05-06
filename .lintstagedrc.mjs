const config = {
  '*.{cjs,cts,js,mjs,mts,ts,tsx}': [
    'yarn prettier --write',
    'eslint --fix',
    'jest --findRelatedTests --passWithNoTests',
  ],
  '*.css': ['yarn prettier --write', 'yarn stylelint --fix'],
  '*.{json,yaml,yml}': 'yarn prettier --write',
  '*.{markdown,md}': ['yarn prettier --write', 'yarn remark'],
  '*ignore-sync': 'ignore-sync',
}
export default config
