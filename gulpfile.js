'use strict'

const gulp = require('gulp')

const argv = require('yargs').argv
const cson = require('cson')
const fs = require('fs-extra')
const gutil = require('gulp-util')
const named = require('vinyl-named')
const path = require('path')
const plugins = require('gulp-load-plugins')()
const webpack = require('webpack')
const webpackStream = require('webpack-stream')

// predefined path
const compilePath = '__compile'
const devPath = '__dev'
const resourcesPath = '_resources'

// language config
const lang = {
  css: {
    extName: 'styl',
    compiler: 'stylus',
    minifer: 'minifyCss',
    source: 'css',
    dest: 'css'
  },
  html: {
    extName: 'jade',
    compiler: 'jade',
    source: 'html',
    dest: '.'
  },
  js: {
    extName: 'js',
    source: 'js',
    dest: 'js'
  }
}

// language handlers
function compileJS(destDir) {
  const isDev = destDir === devPath
  const resolveAlias = {}
  const thisLang = lang.js
  const webpackPlugins = [
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.optimize.DedupePlugin()
  ]

  const destPath = path.join(destDir, thisLang.dest)
  const sourcePath = getSourcePath(thisLang)

  fs.mkdirsSync(destPath)

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

  const stream = gulp.src(sourcePath)
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
    .pipe(gulp.dest(destPath))

  // if webpack is watching, it blocks other gulp tasks
  if (!isDev) {
    return stream
  }
}

function compileLang(langName, destDir, options) {
  const thisLang = lang[langName]

  fs.mkdirsSync(path.join(destDir, thisLang.dest))

  return compileLangHandler(
    thisLang,
    getSourcePath(thisLang),
    destDir,
    options
  )
}

function compileLangHandler(thisLang, sourcePath, destDir, options) {
  if (!options) {
    options = {}
  }

  const compilerPipe = plugins[thisLang.compiler]
    .apply(null, options.compilerConfig)
  const dest = path.join(destDir, thisLang.dest)

  const compileStream = gulp.src(sourcePath)
    .pipe(compilerPipe)

  if (destDir === compilePath && thisLang.minifer) {
    const miniferPipe = plugins[thisLang.minifer]
      .apply(null, options.miniferConfig)

    compileStream.pipe(miniferPipe)
  }

  return compileStream.pipe(gulp.dest(dest))
}

function compileManifest(destDir, updateFn) {
  const destPath = path.join(destDir, 'manifest.json')
  const manifestJSON = cson.load(path.join(resourcesPath, 'manifest.cson'))

  updateFn(manifestJSON)

  fs.writeJSONSync(destPath, manifestJSON)
}

function getSourcePath(thisLang) {
  return path.join(thisLang.source, '*.' + thisLang.extName)
}

function watchLang(langName, destDir, options) {
  const thisLang = lang[langName]

  gulp.watch(getSourcePath(thisLang), function(event) {
    const sourcePath = path.relative(__dirname, event.path)

    compileLangHandler(thisLang, sourcePath, destDir, options)
      .on('end', function() {
        gutil.log(gutil.colors.magenta(sourcePath), 'is compiled')
      })
  })

  return compileLang(langName, destDir, options)
}

// markdown handler
function getMarkdownData(titleList) {
  const mdSource = path.join(resourcesPath, 'markdown')

  const dataList = titleList.map(function(title) {
    const fileData = fs.readFileSync(
      path.join(mdSource, `${title}.md`), 'utf-8'
    )

    return (
      `## ${title}` +
      '\n\n' +
      fileData
    )
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

// user guideline
gulp.task('help', function() {
  gutil.log('\n' + getMarkdownData(['Developer guide']))
})

// compile and zip PmB
gulp.task('compile-init', function() {
  const version = argv.version

  const versionCheck = function(x) {
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

  initDir(compilePath)
})

gulp.task('compile-css', ['compile-init'], function() {
  return compileLang('css', compilePath, {
    compilerConfig: [{'include css': true}],
    miniferConfig: [{keepSpecialComments: 0}]
  })
})

gulp.task('compile-html', ['compile-init'], function() {
  return compileLang('html', compilePath)
})

gulp.task('compile-js', ['compile-init'], function() {
  return compileJS(compilePath)
})

gulp.task('compile-others', ['compile-init'], function() {
  const fileList = ['font', '_locales', 'LICENSE']

  fileList.forEach(function(fileName) {
    fs.copySync(fileName, path.join(compilePath, fileName))
  })
  fs.copySync(path.join(resourcesPath, 'img'), path.join(compilePath, 'img'))

  compileManifest(compilePath, function(manifestJSON) {
    manifestJSON.version = argv.version
  })
})

gulp.task('compile-zip', [
  'compile-css',
  'compile-html',
  'compile-js',
  'compile-others'
], function() {
  return gulp.src(path.join(compilePath, '**'))
    .pipe(plugins.zip(argv.version + '.zip'))
    .pipe(gulp.dest('.'))
})

gulp.task('compile', ['compile-zip'], function() {
  // useless after zipped
  fs.remove(compilePath)
})

// create a 'watched' folder for testing
gulp.task('dev-init', function() {
  initDir(devPath)
})

gulp.task('dev-css', ['dev-init'], function() {
  return watchLang('css', devPath, {
    compilerConfig: [{'include css': true}]
  })
})

gulp.task('dev-html', ['dev-init'], function() {
  return watchLang('html', devPath, {
    compilerConfig: [{pretty: true}]
  })
})

gulp.task('dev-js', ['dev-init'], function() {
  return compileJS(devPath)
})

gulp.task('dev', [
  'dev-css',
  'dev-html',
  'dev-js'
], function() {
  const fileList = ['font', '_locales']

  fileList.forEach(function(fileName) {
    fs.symlinkSync(
      path.join('..', fileName),
      path.join(devPath, fileName),
      'dir'
    )
  })
  fs.symlinkSync(
    path.join('..', resourcesPath, 'img-dev'),
    path.join(devPath, 'img'),
    'dir'
  )

  compileManifest(devPath, function(manifestJSON) {
    manifestJSON.name += '(dev)'
    manifestJSON.version = '0.0.0.0'
  })
})

// Lints
gulp.task('lint-css', function() {
  return gulp.src(path.join(lang.css.source, '*'))
    .pipe(plugins.stylint())
})

gulp.task('lint-js', function() {
  return gulp.src([
    'gulpfile.js',
    path.join(lang.js.source, '**')
  ])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
})

gulp.task('lint', ['lint-css', 'lint-js'])

// generate markdown file
gulp.task('md', function() {
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
