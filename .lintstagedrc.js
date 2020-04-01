'use strict'

module.exports = {
  '*.{js,ts,tsx}': [
    'yarn prettier --write',
    'yarn eslint --fix',
    'jest --bail --findRelatedTests --config .jestrc.json',
  ],
  '*.{json,yaml,yml}': (filenames) => {
    const commands = []

    filenames
      .filter((name) => /\/package\.json$/.test(name))
      .forEach((name) => {
        commands.push(`sort-package-json ${name}`)
      })

    commands.push(`yarn prettier --write ${filenames.join(' ')}`)

    return commands
  },
  '*.css': ['yarn prettier --write', 'yarn stylelint --fix'],
  '*.md': (filenames) => {
    return [`yarn prettier --write ${filenames.join(' ')}`, 'yarn remark .']
  },
  '*ignore-sync': 'ignore-sync',
}
