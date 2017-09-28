'use strict'

const R = require('ramda')

const getMergedConfigByEnv = R.converge(R.mergeDeepWith(R.concat), [
  R.prop('default'),
  R.propOr({}, process.env.NODE_ENV)
])

module.exports = getMergedConfigByEnv({
  default: {
    appNames: ['options', 'popup'],
    commonChunkName: 'common',
    sourceDir: 'src'
  },
  development: {
    outputDir: '__dev'
  },
  production: {
    outputDir: '__build'
  }
})
