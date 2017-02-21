'use strict'

const cssnext = require('postcss-cssnext')
const postcssImport = require('postcss-import')
const postcssUrl = require('postcss-url')

module.exports = {
  plugins: [
    postcssUrl(),
    postcssImport(),
    cssnext({
      autoprefixer: {
        browsers: 'chrome >= 34'
      }
    })
  ]
}
