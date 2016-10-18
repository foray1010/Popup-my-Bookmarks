'use strict'

const _ = require('lodash')
const bluebird = require('bluebird')
const co = require('co')
const fs = require('fs-extra')
const gulp = require('gulp')
const gulpFilter = require('gulp-filter')
const gutil = require('gulp-util')
const imageGrayScale = require('gulp-image-grayscale')
const path = require('path')
const plumber = require('gulp-plumber')
const pug = require('gulp-pug')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const YAML = require('yamljs')
const zip = require('gulp-zip')

const config = require('./config')
const pkg = require('./package')
const webpackConfig = require('./webpack.config')

// promisify
bluebird.promisifyAll(fs)

// predefined dir path
const outputDir = config.outputDir
const sourceDir = config.sourceDir

// language handlers
function buildHtml(options) {
  return co(function* () {
    const manifest = getManifest()
    _.set(options, 'pugOptions.data.name', manifest.name)

    const srcPath = path.join(sourceDir, 'html', '*.pug')

    const buildHandler = (thisSrcPath) => {
      return gulp.src(thisSrcPath)
        .pipe(plumber())
        .pipe(pug(options.pugOptions))
        .pipe(gulp.dest(outputDir))
    }

    if (options.watch) {
      gulp.watch(srcPath, (evt) => {
        const thisSrcPath = path.relative(__dirname, evt.path)

        buildHandler(thisSrcPath)
          .on('end', () => {
            gutil.log(gutil.colors.magenta(thisSrcPath), 'is built')
          })
      })
    }

    return buildHandler(srcPath)
  })
}

function* buildManifest() {
  const manifest = getManifest()

  yield fs.writeJsonAsync(
    path.join(outputDir, 'manifest.json'),
    manifest
  )
}

function getManifest() {
  const manifest = YAML.load(
    path.join(sourceDir, 'manifest.yml')
  )

  manifest.version = pkg.version
  if (process.env.NODE_ENV === 'development') {
    manifest.name += ' (dev)'
  }

  return manifest
}

function runWebpack() {
  return plumber()
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest('.'))
}

function validatePackageVersion() {
  const version = pkg.version
  if (!/^([1-9]?\d\.){2}[1-9]?\d$/.test(version)) {
    throw Error('You need to input a version number x.y.z, each number between 0 - 99')
  }
}

// markdown handler
function* getMarkdownData(titleList) {
  const dataList = yield titleList.map((title) => {
    return fs.readFileAsync(path.join('markdown', `${title}.md`), 'utf-8')
  })

  return dataList.join('\n\n')
}

// initiate the output folder
function* initDir() {
  yield fs.removeAsync(outputDir)
  yield fs.mkdirAsync(outputDir)
}

// default when no task
gulp.task('default', ['help'])

// build and zip PmB
gulp.task('build:init', () => {
  return co(function* () {
    validatePackageVersion()

    yield initDir()
  })
})

gulp.task('build:html', ['build:init'], () => {
  return buildHtml({
    watch: false
  })
})

gulp.task('build:webpack', ['build:init'], () => {
  return runWebpack()
})

gulp.task('build:others', ['build:init'], () => {
  return co(function* () {
    const fileList = [
      '_locales',
      'font',
      'img'
    ]
    yield fileList.map((fileName) => fs.copyAsync(
      path.join(sourceDir, fileName),
      path.join(outputDir, fileName)
    ))

    const licenseFile = 'LICENSE'
    yield fs.copyAsync(
      licenseFile,
      path.join(outputDir, licenseFile)
    )

    yield buildManifest()
  })
})

gulp.task('build:zip', [
  'build:html',
  'build:webpack',
  'build:others'
], () => {
  return gulp.src(path.join(outputDir, '**'))
    .pipe(zip(pkg.version + '.zip'))
    .pipe(gulp.dest('.'))
})

gulp.task('build', ['build:zip'], () => {
  return co(function* () {
    // useless after zipped
    yield fs.removeAsync(outputDir)
  })
})

// create a watched folder for testing
gulp.task('dev:init', () => {
  return co(function* () {
    validatePackageVersion()

    yield initDir()
  })
})

gulp.task('dev:html', ['dev:init'], () => {
  return buildHtml({
    pugOptions: {
      pretty: true
    },
    watch: true
  })
})

gulp.task('dev:img', ['dev:init'], () => {
  const iconFilter = gulpFilter(path.join(sourceDir, 'img', 'icon*.png'), {
    restore: true
  })

  return gulp.src(path.join(sourceDir, 'img', '*'))
    .pipe(iconFilter)
      .pipe(imageGrayScale({
        logProgress: false
      }))
    .pipe(iconFilter.restore)
    .pipe(gulp.dest(path.join(outputDir, 'img')))
})

gulp.task('dev:webpack', ['dev:init'], () => {
  // don't return because webpack `watch` will hold the pipe
  runWebpack()
})

gulp.task('dev:others', ['dev:init'], () => {
  return co(function* () {
    const fileList = [
      'font',
      '_locales'
    ]
    yield fileList.map((fileName) => fs.symlinkAsync(
      path.join('..', sourceDir, fileName),
      path.join(outputDir, fileName),
      'dir'
    ))

    yield buildManifest()
  })
})

gulp.task('dev', [
  'dev:html',
  'dev:img',
  'dev:webpack',
  'dev:others'
])

// user guideline
gulp.task('help', () => {
  return co(function* () {
    const developerGuideMD = yield getMarkdownData(['developer_guide'])

    gutil.log('\n' + developerGuideMD)
  })
})

// generate markdown file
gulp.task('md:readme', () => {
  return co(function* () {
    const fileName = 'README.md'

    let fileData = yield getMarkdownData([
      'title',
      'description',
      'stable_version',
      'developer_guide',
      'todo',
      'contributing'
    ])

    // enlarge first header
    fileData = fileData.replace(/^##/, '#')

    yield fs.writeFileAsync(fileName, fileData)
  })
})

gulp.task('md:store', () => {
  return co(function* () {
    const fileName = '__store.md'

    let fileData = yield getMarkdownData([
      'description',
      'todo',
      'contributing'
    ])

    fileData = fileData
      // remove style of subheader
      .replace(/##### /g, '')
      .trim()

    yield fs.writeFileAsync(fileName, fileData)
  })
})

gulp.task('md', ['md:readme', 'md:store'])
