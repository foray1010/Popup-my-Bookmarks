'use strict'

const path = require('path')
const YAML = require('yamljs')

const {sourceDir} = require('./config')
const pkg = require('./package')

const manifest = YAML.load(
  path.join(sourceDir, 'manifest.yml')
)

manifest.version = pkg.version
if (process.env.NODE_ENV === 'development') {
  manifest.name += ' (dev)'
}

module.exports = manifest
