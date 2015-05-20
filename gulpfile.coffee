gulp = require('gulp')

argv = require('yargs').argv
clc = require('cli-color')
cson = require('cson')
fs = require('fs-extra')
path = require('path')
plugins = require('gulp-load-plugins')()

# language config
lang =
  css:
    extName: 'styl'
    plugin: 'stylus'
    source: 'css'
    dest: 'css'
  html:
    extName: 'jade'
    plugin: 'jade'
    source: 'html'
    dest: '.'
  js:
    extName: 'js'
    plugin: 'uglify'
    source: 'js'
    dest: 'js'

# predefined path
compilePath = '__compile'
devPath = '__dev'
resourcesPath = '_resources'

# language handlers
compileLang = (langName, destDir, options) ->
  thisLang = lang[langName]

  fs.mkdirsSync(path.join(destDir, thisLang.dest))

  compileLangHandler(thisLang, getSourcePath(thisLang), destDir, options)

compileLangHandler = (thisLang, sourcePath, destDir, options) ->
  nowTime = new Date().toLocaleTimeString()
  console.log('[' + clc.blackBright(nowTime) + '] ' +
              clc.magenta(sourcePath) + ' is compiled')

  gulp.src(sourcePath)
    .pipe(plugins[thisLang.plugin](options))
    .pipe(gulp.dest(path.join(destDir, thisLang.dest)))

compileManifest = (destDir, updateFn) ->
  manifestJSON = cson.load(path.join(resourcesPath, 'manifest.cson'))
  updateFn(manifestJSON)

  destPath = path.join(destDir, 'manifest.json')
  fs.writeJSONSync(destPath, manifestJSON)

getSourcePath = (thisLang) ->
  path.join(thisLang.source, '*.' + thisLang.extName)

watchLang = (langName, destDir, options) ->
  thisLang = lang[langName]

  compileLang(langName, destDir, options)

  gulp.watch(getSourcePath(thisLang), (event) ->
    compileLangHandler(thisLang, event.path, destDir, options)
  )

# markdown handler
getMarkdownData = (titleList) ->
  mdSource = path.join(resourcesPath, 'markdown')

  dataList = []
  for title in titleList
    fileData = fs.readFileSync(path.join(mdSource, "#{title}.md"), 'utf-8')
    dataList.push("""
## #{title}

#{fileData}
""")

  return dataList.join('\n\n')

# initiate the output folder
initDir = (dirPath) ->
  fs.removeSync(dirPath)
  fs.mkdirSync(dirPath)

# default when no task
gulp.task('default', ['help'])

# user guideline
gulp.task('help', ->
  console.log('\n' + getMarkdownData(['Developer guide']) + '\n')
)

# compile and zip PmB
gulp.task('compile-init', ->
  versionCheck = (x) -> x is "#{parseInt(x)}" and 0 <= x <= 65535

  if argv.version is undefined or
     argv.version.split('.').length isnt 4 or
     not argv.version.split('.').every(versionCheck)
    throw Error('You need to input a version number x.y.z.ddmm,
                 each number between 0 - 65535')

  initDir(compilePath)
)

gulp.task('compile-main', ['compile-init'], ->
  compileLang('css', compilePath, compress: true)
  compileLang('html', compilePath)
  compileLang('js', compilePath)
)

gulp.task('compile-others', ['compile-init'], ->
  for fileName in ['font', '_locales', 'LICENSE']
    fs.copySync(fileName, path.join(compilePath, fileName))
  fs.copySync(path.join(resourcesPath, 'img'), path.join(compilePath, 'img'))

  compileManifest(compilePath, (manifestJSON) ->
    manifestJSON.version = argv.version
  )
)

gulp.task('compile-zip', ['compile-main', 'compile-others'], ->
  gulp.src(path.join(compilePath, '**'))
    .pipe(plugins.zip(argv.version + '.zip'))
    .pipe(gulp.dest('.'))
)

gulp.task('compile', ['compile-zip'], ->
  fs.removeSync(compilePath) # useless after zipped
)

# create a 'watched' folder for testing
gulp.task('dev', ->
  initDir(devPath)

  watchLang('css', devPath)
  watchLang('html', devPath, pretty: true)

  for fileName in ['font', '_locales', lang.js.source]
    source = path.join('..', fileName)
    dest = path.join(devPath, fileName)
    fs.symlinkSync(source, dest, 'dir')
  source = path.join('..', resourcesPath, 'img-dev')
  dest = path.join(devPath, 'img')
  fs.symlinkSync(source, dest, 'dir')

  compileManifest(devPath, (manifestJSON) ->
    manifestJSON.name += '(dev)'
    manifestJSON.version = '0.0.0.0'
  )
)

# Lints
gulp.task('lint', ->
  gulp.src(path.join(lang.css.source, '*'))
    .pipe(plugins.stylint())

  gulp.src(path.join(lang.js.source, '*'))
    .pipe(plugins.jscs())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))

  gulp.src('*.coffee')
    .pipe(plugins.coffeelint())
    .pipe(plugins.coffeelint.reporter())
)

# generate markdown file
gulp.task('md', ->
  fileName = argv.make

  switch fileName
    when '__store.md'
      fileData = getMarkdownData([
        'Popup my Bookmarks'
        'Plan to do'
        'What you can help'
        'FAQ'
      ])

      # remove first three lines
      fileData = fileData.replace(/.+\n\n.+\n/, '')

      # remove style of subheader
      fileData = fileData.replace(/##### /g, '')

    when 'README.md'
      fileData = getMarkdownData([
        'Popup my Bookmarks'
        'Developer guide'
        'Plan to do'
        'What you can help'
        'FAQ'
      ])

      # enlarge first header
      fileData = fileData.replace(/^##/, '#')

    else
      throw Error("Unknown markdown file: #{fileName}")

  fs.writeFile(fileName, fileData)
)
