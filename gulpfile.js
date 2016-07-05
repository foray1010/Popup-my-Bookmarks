'use strict'

const bluebird = require('bluebird')
const co = require('co')
const fs = require('fs-extra')
const gulp = require('gulp')
const gulpFilter = require('gulp-filter')
const gutil = require('gulp-util')
const imageGrayScale = require('gulp-image-grayscale')
const jade = require('gulp-jade')
const named = require('vinyl-named')
const nano = require('gulp-cssnano')
const path = require('path')
const plumber = require('gulp-plumber')
const stylus = require('gulp-stylus')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const YAML = require('yamljs')
const zip = require('gulp-zip')

const packageJSON = require('./package')

// promisify
bluebird.promisifyAll(fs)

// predefined dir path
const buildDir = '__build'
const devDir = '__dev'
const sourceDir = 'src'

// language config
const lang = {
  css: {
    extname: '.styl',
    destDir: 'css',
    srcDir: path.join(sourceDir, 'css')
  },
  html: {
    extname: '.jade',
    destDir: '.',
    srcDir: path.join(sourceDir, 'html')
  },
  js: {
    extname: '.js?(x)',
    destDir: 'js',
    srcDir: path.join(sourceDir, 'js')
  }
}

// language handlers
function buildJS(workingDir) {
  // define in here because it depends on process.env.NODE_ENV
  const webpackConfig = require('./webpack.config')

  const thisLang = lang.js

  const destDir = path.join(workingDir, thisLang.destDir)
  const srcPath = path.join(thisLang.srcDir, '*' + thisLang.extname)

  return gulp.src(srcPath)
    .pipe(plumber())
    .pipe(named())
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(destDir))
}

function buildLang(langName, workingDir, options) {
  if (!options) {
    options = {}
  }

  const isDev = process.env.NODE_ENV === 'development'
  const thisLang = lang[langName]

  const srcPath = path.join(thisLang.srcDir, '*' + thisLang.extname)

  const buildHandler = (thisSrcPath) => {
    const destDir = path.join(workingDir, thisLang.destDir)

    return gulp.src(thisSrcPath)
      .pipe(plumber())
      .pipe(options.builderPipe ? options.builderPipe() : gutil.noop())
      .pipe(options.miniferPipe ? options.miniferPipe() : gutil.noop())
      .pipe(gulp.dest(destDir))
  }

  if (isDev) {
    gulp.watch(srcPath, (evt) => {
      const thisSrcPath = path.relative(__dirname, evt.path)

      buildHandler(thisSrcPath)
        .on('end', () => {
          gutil.log(gutil.colors.magenta(thisSrcPath), 'is built')
        })
    })
  }

  return buildHandler(srcPath)
}

function* buildManifest(workingDir, updateFn) {
  const destPath = path.join(workingDir, 'manifest.json')
  const manifestJSON = YAML.load(path.join(sourceDir, 'manifest.yml'))

  manifestJSON.version = packageJSON.version
  if (updateFn) {
    updateFn(manifestJSON)
  }

  yield fs.writeJSONAsync(destPath, manifestJSON)
}

function validatePackageVersion() {
  const version = packageJSON.version
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
function* initDir(workingDir) {
  yield fs.removeAsync(workingDir)
  yield fs.mkdirAsync(workingDir)

  for (const langName of Object.keys(lang)) {
    const thisLang = lang[langName]

    yield fs.mkdirsAsync(path.join(workingDir, thisLang.destDir))
  }
}

// default when no task
gulp.task('default', ['help'])

// build and zip PmB
gulp.task('build:init', () => {
  return co(function* () {
    process.env.NODE_ENV = 'production'

    validatePackageVersion()

    yield initDir(buildDir)
  })
})

gulp.task('build:css', ['build:init'], () => {
  return buildLang('css', buildDir, {
    builderPipe: () => stylus({'include css': true}),
    miniferPipe: () => nano({
      autoprefixer: false,
      discardComments: {removeAll: true}
    })
  })
})

gulp.task('build:html', ['build:init'], () => {
  return buildLang('html', buildDir, {
    builderPipe: () => jade()
  })
})

gulp.task('build:js', ['build:init'], () => {
  return buildJS(buildDir)
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
      path.join(buildDir, fileName)
    ))

    const licenseFile = 'LICENSE'
    yield fs.copyAsync(
      licenseFile,
      path.join(buildDir, licenseFile)
    )

    yield buildManifest(buildDir)
  })
})

gulp.task('build:zip', [
  'build:css',
  'build:html',
  'build:js',
  'build:others'
], () => {
  return gulp.src(path.join(buildDir, '**'))
    .pipe(zip(packageJSON.version + '.zip'))
    .pipe(gulp.dest('.'))
})

gulp.task('build', ['build:zip'], () => {
  return co(function* () {
    // useless after zipped
    yield fs.removeAsync(buildDir)
  })
})

// create a watched folder for testing
gulp.task('dev:init', () => {
  return co(function* () {
    process.env.NODE_ENV = 'development'

    validatePackageVersion()

    yield initDir(devDir)
  })
})

gulp.task('dev:css', ['dev:init'], () => {
  return buildLang('css', devDir, {
    builderPipe: () => stylus({'include css': true})
  })
})

gulp.task('dev:html', ['dev:init'], () => {
  return buildLang('html', devDir, {
    builderPipe: () => jade({pretty: true})
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
    .pipe(gulp.dest(path.join(devDir, 'img')))
})

gulp.task('dev:js', ['dev:init'], () => {
  // don't return because webpack `watch` will hold the pipe
  buildJS(devDir)
})

gulp.task('dev:others', ['dev:init'], () => {
  return co(function* () {
    const fileList = [
      'font',
      '_locales'
    ]
    yield fileList.map((fileName) => fs.symlinkAsync(
      path.join('..', sourceDir, fileName),
      path.join(devDir, fileName),
      'dir'
    ))

    yield buildManifest(devDir, (manifestJSON) => {
      manifestJSON.name += ' (dev)'
    })
  })
})

gulp.task('dev', [
  'dev:css',
  'dev:html',
  'dev:img',
  'dev:js',
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
      'contributing',
      'faq'
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
      'contributing',
      'faq'
    ])

    fileData = fileData
      // remove style of subheader
      .replace(/##### /g, '')
      .trim()

    yield fs.writeFileAsync(fileName, fileData)
  })
})

gulp.task('md', ['md:readme', 'md:store'])
