'use strict'

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

  fs.mkdirsSync(path.join(workingDir, thisLang.destDir))

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

function compileManifest(workingDir, updateFn) {
  const destPath = path.join(workingDir, 'manifest.json')
  const manifestJSON = cson.load(path.join(resourcesDir, 'manifest.cson'))

  manifestJSON.version = packageJSON.version
  if (updateFn) {
    updateFn(manifestJSON)
  }

  fs.writeJSONSync(destPath, manifestJSON)
}

function validatePackageVersion() {
  const version = packageJSON.version
  if (typeof version !== 'string' || !/^([1-9]?\d\.){2}[1-9]?\d$/.test(version)) {
    throw Error('You need to input a version number x.y.z, each number between 0 - 99')
  }
}

// markdown handler
function getMarkdownData(titleList) {
  const mdSource = path.join(resourcesDir, 'markdown')

  const dataList = titleList.map((title) => {
    const fileData = fs.readFileSync(path.join(mdSource, `${title}.md`), 'utf-8')

    return `## ${title}\n\n${fileData}`
  })

  return dataList.join('\n\n')
}

// initiate the output folder
function initDir(dirPath) {
  fs.removeSync(dirPath)
  fs.mkdirSync(dirPath)
}

// default when no task
gulp.task('default', ['help'])

// compile and zip PmB
gulp.task('compile:init', () => {
  process.env.NODE_ENV = 'production'

  validatePackageVersion()

  initDir(compileDir)
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
  const fileList = ['font', '_locales', 'LICENSE']

  for (const fileName of fileList) {
    fs.copySync(fileName, path.join(compileDir, fileName))
  }
  fs.copySync(path.join(resourcesDir, 'img'), path.join(compileDir, 'img'))

  compileManifest(compileDir)
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
  // useless after zipped
  fs.remove(compileDir)
})

// create a watched folder for testing
gulp.task('dev:init', () => {
  process.env.NODE_ENV = 'development'

  validatePackageVersion()

  initDir(devDir)
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
  compileJS(devDir)
})

gulp.task('dev', [
  'dev:css',
  'dev:html',
  'dev:js'
], () => {
  const fileList = ['font', '_locales']

  for (const fileName of fileList) {
    fs.symlinkSync(
      path.join('..', fileName),
      path.join(devDir, fileName),
      'dir'
    )
  }
  fs.symlinkSync(
    path.join('..', resourcesDir, 'img-dev'),
    path.join(devDir, 'img'),
    'dir'
  )

  compileManifest(devDir, (manifestJSON) => {
    manifestJSON.name += ' (dev)'
  })
})

// user guideline
gulp.task('help', () => {
  gutil.log('\n' + getMarkdownData(['Developer guide']))
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
  const fileName = 'README.md'

  let fileData = getMarkdownData([
    'Popup my Bookmarks',
    'Developer guide',
    'Todo',
    'Contributing',
    'FAQ'
  ])

  // enlarge first header
  fileData = fileData.replace(/^##/, '#')

  fs.writeFile(fileName, fileData)
})

gulp.task('md:store', () => {
  const fileName = '__store.md'

  let fileData = getMarkdownData([
    'Popup my Bookmarks',
    'Todo',
    'Contributing',
    'FAQ'
  ])

  // remove first three lines
  fileData = fileData.replace(/.+\n\n.+\n/, '')

  // remove style of subheader
  fileData = fileData.replace(/##### /g, '')

  fs.writeFile(fileName, fileData)
})

gulp.task('md', ['md:readme', 'md:store'])
