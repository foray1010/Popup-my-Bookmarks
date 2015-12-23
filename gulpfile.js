/* eslint strict: 0 */
'use strict'

const argv = require('yargs').argv
const cson = require('cson')
const eslint = require('gulp-eslint')
const fs = require('fs-extra')
const gulp = require('gulp')
const gutil = require('gulp-util')
const jade = require('gulp-jade')
const minifyCss = require('gulp-minify-css')
const named = require('vinyl-named')
const path = require('path')
const stylint = require('gulp-stylint')
const stylus = require('gulp-stylus')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const zip = require('gulp-zip')

// predefined dir path
const compileDir = '__compile'
const devDir = '__dev'
const resourcesDir = '_resources'

// language config
const lang = {
  css: {
    destDir: 'css',
    srcPath: path.join('css', '*') + '.styl',
    compiler: stylus,
    minifer: minifyCss
  },
  html: {
    destDir: '.',
    srcPath: path.join('html', '*') + '.jade',
    compiler: jade
  },
  js: {
    destDir: 'js',
    srcPath: path.join('js', '*') + '.js'
  }
}

// language handlers
function compileJS(workingDir) {
  const isDev = workingDir === devDir
  const resolveAlias = {}
  const thisLang = lang.js
  const webpackPlugins = [
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.optimize.DedupePlugin()
  ]

  const destDir = path.join(workingDir, thisLang.destDir)
  const srcPath = thisLang.srcPath

  if (!isDev) {
    // production build does not freeze the object,
    // which significantly improves performance
    resolveAlias['seamless-immutable'] = 'seamless-immutable/' +
      'seamless-immutable.production.min'

    webpackPlugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: true,
        pure_getters: true,
        unsafe: true,
        warnings: false
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }))
  }

  return gulp.src(srcPath)
    .pipe(named())
    .pipe(webpackStream({
      devtool: isDev ? 'source-map' : undefined,
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader'
          }
        ]
      },
      plugins: webpackPlugins,
      resolve: {
        alias: resolveAlias
      },
      stats: {
        timings: true,
        version: false
      },
      watch: isDev
    }, webpack))
    .pipe(gulp.dest(destDir))
}

function compileLang(langName, workingDir, options) {
  if (!options) {
    options = {}
  }

  const isDev = workingDir === devDir
  const thisLang = lang[langName]

  const compileHandler = (srcPath) => {
    const compilerPipe = thisLang.compiler.apply(null, options.compilerConfig)
    const destDir = path.join(workingDir, thisLang.destDir)

    const compileStream = gulp.src(srcPath).pipe(compilerPipe)

    if (!isDev && thisLang.minifer) {
      const miniferPipe = thisLang.minifer.apply(null, options.miniferConfig)

      compileStream.pipe(miniferPipe)
    }

    return compileStream.pipe(gulp.dest(destDir))
  }

  fs.mkdirsSync(path.join(workingDir, thisLang.destDir))

  if (isDev) {
    gulp.watch(thisLang.srcPath, (event) => {
      const srcPath = path.relative(__dirname, event.path)

      compileHandler(srcPath)
        .on('end', () => {
          gutil.log(gutil.colors.magenta(srcPath), 'is compiled')
        })
    })
  }

  return compileHandler(thisLang.srcPath)
}

function compileManifest(workingDir, updateFn) {
  const destPath = path.join(workingDir, 'manifest.json')
  const manifestJSON = cson.load(path.join(resourcesDir, 'manifest.cson'))

  updateFn(manifestJSON)

  fs.writeJSONSync(destPath, manifestJSON)
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
gulp.task('compile-init', () => {
  const version = argv.version

  const versionCheck = (x) => {
    return (
      x === `${parseInt(x, 10)}` &&
      x >= 0 &&
      x <= 65535
    )
  }

  if (typeof version !== 'string' ||
      version.split('.').length !== 4 ||
      !version.split('.').every(versionCheck)) {
    throw Error('You need to input a version number x.y.z.ddmm, ' +
      'each number between 0 - 65535')
  }

  initDir(compileDir)
})

gulp.task('compile-css', ['compile-init'], () => {
  return compileLang('css', compileDir, {
    compilerConfig: [{'include css': true}],
    miniferConfig: [{keepSpecialComments: 0}]
  })
})

gulp.task('compile-html', ['compile-init'], () => {
  return compileLang('html', compileDir)
})

gulp.task('compile-js', ['compile-init'], () => {
  return compileJS(compileDir)
})

gulp.task('compile-others', ['compile-init'], () => {
  const fileList = ['font', '_locales', 'LICENSE']

  for (const fileName of fileList) {
    fs.copySync(fileName, path.join(compileDir, fileName))
  }
  fs.copySync(path.join(resourcesDir, 'img'), path.join(compileDir, 'img'))

  compileManifest(compileDir, (manifestJSON) => {
    manifestJSON.version = argv.version
  })
})

gulp.task('compile-zip', [
  'compile-css',
  'compile-html',
  'compile-js',
  'compile-others'
], () => {
  return gulp.src(path.join(compileDir, '**'))
    .pipe(zip(argv.version + '.zip'))
    .pipe(gulp.dest('.'))
})

gulp.task('compile', ['compile-zip'], () => {
  // useless after zipped
  fs.remove(compileDir)
})

// create a watched folder for testing
gulp.task('dev-init', () => {
  initDir(devDir)
})

gulp.task('dev-css', ['dev-init'], () => {
  return compileLang('css', devDir, {
    compilerConfig: [{'include css': true}]
  })
})

gulp.task('dev-html', ['dev-init'], () => {
  return compileLang('html', devDir, {
    compilerConfig: [{pretty: true}]
  })
})

gulp.task('dev-js', ['dev-init'], () => {
  compileJS(devDir)
})

gulp.task('dev', [
  'dev-css',
  'dev-html',
  'dev-js'
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
    manifestJSON.name += '(dev)'
    manifestJSON.version = '0.0.0.0'
  })
})

// user guideline
gulp.task('help', () => {
  gutil.log('\n' + getMarkdownData(['Developer guide']))
})

// lints
gulp.task('lint-css', () => {
  return gulp.src(lang.css.srcPath)
    .pipe(stylint())
})

gulp.task('lint-js', () => {
  return gulp.src([
    'gulpfile.js',
    // check the inner directories too
    lang.js.srcPath.replace('*', path.join('**', '*'))
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('lint', ['lint-css', 'lint-js'])

// generate markdown file
gulp.task('md', () => {
  const fileName = argv.make

  let fileData

  switch (fileName) {
    case '__store.md':
      fileData = getMarkdownData([
        'Popup my Bookmarks',
        'Todo',
        'Contributing',
        'FAQ'
      ])

      // remove first three lines
      fileData = fileData.replace(/.+\n\n.+\n/, '')

      // remove style of subheader
      fileData = fileData.replace(/##### /g, '')
      break

    case 'README.md':
      fileData = getMarkdownData([
        'Popup my Bookmarks',
        'Developer guide',
        'Todo',
        'Contributing',
        'FAQ'
      ])

      // enlarge first header
      fileData = fileData.replace(/^##/, '#')
      break

    default:
      throw Error(`Unknown markdown file: ${fileName}`)
  }

  fs.writeFile(fileName, fileData)
})
