'use strict'

const cssnext = require('postcss-cssnext')
const postcssImport = require('postcss-import')

const manifest = require('./manifest')

module.exports = {
  plugins: [
    postcssImport(),
    cssnext({
      autoprefixer: {
        browsers: `Chrome >= ${manifest.minimum_chrome_version}`
      }
    })
  ]
}
