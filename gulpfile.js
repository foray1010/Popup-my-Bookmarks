'use strict'

const bluebird = require('bluebird')
const co = require('co')
const fs = require('fs-extra')
const gulp = require('gulp')
const gulpFilter = require('gulp-filter')
const gutil = require('gulp-util')
const imageGrayScale = require('gulp-image-grayscale')
const path = require('path')
const plumber = require('gulp-plumber')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const zip = require('gulp-zip')

const {outputDir, sourceDir} = require('./config')
const manifest = require('./manifest')
const pkg = require('./package')
const webpackConfig = require('./webpack.config')

// promisify
bluebird.promisifyAll(fs)

function* buildManifest() {
  yield fs.writeJsonAsync(
    path.join(outputDir, 'manifest.json'),
    manifest
  )
}

function runWebpack() {
  return plumber()
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(webpackConfig.output.path))
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
  'build:webpack',
  'build:others'
], () => {
  return gulp.src(path.join(outputDir, '**'))
    .pipe(zip(pkg.version + '.zip'))
    .pipe(gulp.dest('.'))
})

// cleanup
gulp.task('build', ['build:zip'], () => fs.removeAsync(outputDir))

// create a watched folder for testing
gulp.task('dev:init', () => {
  return co(function* () {
    validatePackageVersion()

    yield initDir()
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
