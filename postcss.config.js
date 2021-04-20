'use strict'

const postcssImport = require('postcss-import')
const postcssNormalize = require('postcss-normalize')
const postcssPresetEnv = require('postcss-preset-env')
const postcssUrl = require('postcss-url')

module.exports = {
  plugins: [
    postcssUrl,
    postcssImport,
    postcssNormalize,
    postcssPresetEnv({ stage: 0 }),
  ],
}
