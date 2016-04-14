'use strict'

const bluebird = require('bluebird')
const co = require('co')
const eslint = require('gulp-eslint')
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
const stylint = require('gulp-stylint')
const stylus = require('gulp-stylus')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const YAML = require('yamljs')
const zip = require('gulp-zip')

const packageJSON = require('./package')

// promisify
bluebird.promisifyAll(fs)

// predefined dir path
const compileDir = '__compile'
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
function compileJS(workingDir) {
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

function compileLang(langName, workingDir, options) {
  if (!options) {
    options = {}
  }

  const isDev = process.env.NODE_ENV === 'development'
  const thisLang = lang[langName]

  const srcPath = path.join(thisLang.srcDir, '*' + thisLang.extname)

  const compileHandler = (thisSrcPath) => {
    const destDir = path.join(workingDir, thisLang.destDir)

    return gulp.src(thisSrcPath)
      .pipe(plumber())
      .pipe(options.compilerPipe ? options.compilerPipe() : gutil.noop())
      .pipe(options.miniferPipe ? options.miniferPipe() : gutil.noop())
      .pipe(gulp.dest(destDir))
  }

  if (isDev) {
    gulp.watch(srcPath, (evt) => {
      const thisSrcPath = path.relative(__dirname, evt.path)

      compileHandler(thisSrcPath)
        .on('end', () => {
          gutil.log(gutil.colors.magenta(thisSrcPath), 'is compiled')
        })
    })
  }

  return compileHandler(srcPath)
}

function* compileManifest(workingDir, updateFn) {
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
  if (typeof version !== 'string' || !/^([1-9]?\d\.){2}[1-9]?\d$/.test(version)) {
    throw Error('You need to input a version number x.y.z, each number between 0 - 99')
  }
}

// markdown handler
function* getMarkdownData(titleList) {
  const dataList = yield titleList.map(function* (title) {
    const fileData = yield fs.readFileAsync(path.join('markdown', `${title}.md`), 'utf-8')

    return `## ${title}\n\n${fileData}`
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

// compile and zip PmB
gulp.task('compile:init', () => {
  return co(function* () {
    process.env.NODE_ENV = 'production'

    validatePackageVersion()

    yield initDir(compileDir)
  })
})

gulp.task('compile:css', ['compile:init'], () => {
  return compileLang('css', compileDir, {
    compilerPipe: () => stylus({'include css': true}),
    miniferPipe: () => nano({
      autoprefixer: false,
      discardComments: {removeAll: true}
    })
  })
})

gulp.task('compile:html', ['compile:init'], () => {
  return compileLang('html', compileDir, {
    compilerPipe: () => jade()
  })
})

gulp.task('compile:js', ['compile:init'], () => {
  return compileJS(compileDir)
})

gulp.task('compile:others', ['compile:init'], () => {
  return co(function* () {
    const fileList = [
      '_locales',
      'font',
      'img'
    ]
    yield fileList.map((fileName) => fs.copyAsync(
      path.join(sourceDir, fileName),
      path.join(compileDir, fileName)
    ))

    const licenseFile = 'LICENSE'
    yield fs.copyAsync(
      licenseFile,
      path.join(compileDir, licenseFile)
    )

    yield compileManifest(compileDir)
  })
})

gulp.task('compile:zip', [
  'compile:css',
  'compile:html',
  'compile:js',
  'compile:others'
], () => {
  return gulp.src(path.join(compileDir, '**'))
    .pipe(zip(packageJSON.version + '.zip'))
    .pipe(gulp.dest('.'))
})

gulp.task('compile', ['compile:zip'], () => {
  return co(function* () {
    // useless after zipped
    yield fs.removeAsync(compileDir)
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
  return compileLang('css', devDir, {
    compilerPipe: () => stylus({'include css': true})
  })
})

gulp.task('dev:html', ['dev:init'], () => {
  return compileLang('html', devDir, {
    compilerPipe: () => jade({pretty: true})
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
  compileJS(devDir)
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

    yield compileManifest(devDir, (manifestJSON) => {
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
    const developerGuideMD = yield getMarkdownData(['Developer guide'])

    gutil.log('\n' + developerGuideMD)
  })
})

// lints
gulp.task('lint:css', () => {
  const srcPath = path.join(lang.css.srcDir, '**', '*' + lang.css.extname)

  return gulp.src(srcPath)
    .pipe(stylint())
})

gulp.task('lint:js', () => {
  return gulp.src([
    path.join(lang.js.srcDir, '**', '*' + lang.js.extname),
    '*' + lang.js.extname
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('lint', ['lint:css', 'lint:js'])

// generate markdown file
gulp.task('md:readme', () => {
  return co(function* () {
    const fileName = 'README.md'

    let fileData = yield getMarkdownData([
      'Popup my Bookmarks',
      'Stable version',
      'Developer guide',
      'Todo',
      'Contributing',
      'FAQ'
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
      'Popup my Bookmarks',
      'Todo',
      'Contributing',
      'FAQ'
    ])

    // remove first three lines
    fileData = fileData.replace(/.+\n\n.+\n/, '')

    // remove style of subheader
    fileData = fileData.replace(/##### /g, '')

    yield fs.writeFileAsync(fileName, fileData)
  })
})

gulp.task('md', ['md:readme', 'md:store'])
