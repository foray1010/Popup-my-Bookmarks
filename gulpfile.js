'use strict'

const bluebird = require('bluebird')
const co = require('co')
const cson = require('cson')
const eslint = require('gulp-eslint')
const fs = require('fs-extra')
const gulp = require('gulp')
const gutil = require('gulp-util')
const jade = require('gulp-jade')
const named = require('vinyl-named')
const nano = require('gulp-cssnano')
const path = require('path')
const plumber = require('gulp-plumber')
const stylint = require('gulp-stylint')
const stylus = require('gulp-stylus')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const zip = require('gulp-zip')

const packageJSON = require('./package')

// promisify
bluebird.promisifyAll(fs)

// predefined dir path
const compileDir = '__compile'
const devDir = '__dev'
const resourcesDir = '_resources'

// language config
const lang = {
  css: {
    extname: '.styl',
    destDir: 'css',
    srcDir: 'css'
  },
  html: {
    extname: '.jade',
    destDir: '.',
    srcDir: 'html'
  },
  js: {
    extname: '.js?(x)',
    destDir: 'js',
    srcDir: 'js'
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
      .pipe(options.compilerPipe || gutil.noop())
      .pipe(options.miniferPipe || gutil.noop())
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
  const manifestJSON = cson.load(path.join(resourcesDir, 'manifest.cson'))

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
  const mdSource = path.join(resourcesDir, 'markdown')

  const dataList = yield titleList.map(function* (title) {
    const fileData = yield fs.readFileAsync(path.join(mdSource, `${title}.md`), 'utf-8')

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
    compilerPipe: stylus({'include css': true}),
    miniferPipe: nano({
      autoprefixer: false,
      discardComments: {removeAll: true}
    })
  })
})

gulp.task('compile:html', ['compile:init'], () => {
  return compileLang('html', compileDir, {
    compilerPipe: jade()
  })
})

gulp.task('compile:js', ['compile:init'], () => {
  return compileJS(compileDir)
})

gulp.task('compile:others', ['compile:init'], () => {
  return co(function* () {
    const fileList = ['font', '_locales', 'LICENSE']

    for (const fileName of fileList) {
      yield fs.copyAsync(fileName, path.join(compileDir, fileName))
    }
    yield fs.copyAsync(path.join(resourcesDir, 'img'), path.join(compileDir, 'img'))

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
    compilerPipe: stylus({'include css': true})
  })
})

gulp.task('dev:html', ['dev:init'], () => {
  return compileLang('html', devDir, {
    compilerPipe: jade({pretty: true})
  })
})

gulp.task('dev:js', ['dev:init'], () => {
  // don't return because webpack `watch` will hold the pipe
  compileJS(devDir)
})

gulp.task('dev:others', ['dev:init'], () => {
  return co(function* () {
    const fileList = ['font', '_locales']

    for (const fileName of fileList) {
      yield fs.symlinkAsync(
        path.join('..', fileName),
        path.join(devDir, fileName),
        'dir'
      )
    }
    yield fs.symlinkAsync(
      path.join('..', resourcesDir, 'img-dev'),
      path.join(devDir, 'img'),
      'dir'
    )

    yield compileManifest(devDir, (manifestJSON) => {
      manifestJSON.name += ' (dev)'
    })
  })
})

gulp.task('dev', [
  'dev:css',
  'dev:html',
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
