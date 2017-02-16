'use strict'

const cssnext = require('postcss-cssnext')
const postcssImport = require('postcss-import')
const postcssUrl = require('postcss-url')

const manifest = require('./manifest')

module.exports = {
  plugins: [
    postcssUrl(),
    postcssImport(),
    cssnext({
      autoprefixer: {
        browsers: `Chrome >= ${manifest.minimum_chrome_version}`
      }
    })
  ]
}
