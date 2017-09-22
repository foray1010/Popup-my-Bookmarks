'use strict'

const cssnext = require('postcss-cssnext')
const postcssImport = require('postcss-import')
const postcssNormalize = require('postcss-normalize')
const postcssUrl = require('postcss-url')

module.exports = {
  plugins: [
    postcssUrl(),
    postcssImport(),
    postcssNormalize({
      forceImport: true
    }),
    cssnext()
  ]
}
