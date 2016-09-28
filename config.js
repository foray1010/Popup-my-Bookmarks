'use strict'

module.exports = {
  outputDir: process.env.NODE_ENV === 'development' ? '__dev' : '__build',
  sourceDir: 'src'
}
