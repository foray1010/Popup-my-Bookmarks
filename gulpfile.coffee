gulp = require 'gulp'

argv = require('yargs').argv
fs = require 'fs-extra'
plugins = require('gulp-load-plugins')()
yamljs = require 'yamljs'

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
compile_path = '__compile'
dev_path = '__dev'
resources_path = '_resources'

initDir = (dir_path) ->
  rmdirp dir_path

  fs.mkdirSync dir_path
  fs.mkdirSync dir_path + '/' + lang.css.dest
  fs.mkdirSync dir_path + '/' + lang.js.dest

# recursively remove folder if exist
rmdirp = (path) ->
  if fs.existsSync path
    fs.removeSync path

# language handlers
compileLang = (lang_name, dest_dir, options) ->
  this_lang = lang[lang_name]

  compileLangHandler this_lang, getSourcePath(this_lang), dest_dir, options
compileLangHandler = (this_lang, source_path, dest_dir, options) ->
  gulp.src source_path
    .pipe plugins[this_lang.plugin](options)
    .pipe gulp.dest(dest_dir + '/' + this_lang.dest)
compileManifest = (dest_dir, update_fn) ->
  manifest_json = yamljs.load resources_path + '/manifest.yml'
  update_fn manifest_json

  dest_path = dest_dir + '/manifest.json'
  fs.writeJSONSync dest_path, manifest_json
getSourcePath = (this_lang) -> this_lang.source + '/*.' + this_lang.extName
watchLang = (lang_name, dest_dir, options) ->
  this_lang = lang[lang_name]

  compileLang lang_name, dest_dir, options

  gulp.watch getSourcePath(this_lang), (event) ->
    compileLangHandler this_lang, event.path, dest_dir, options

# user guideline
gulp.task 'default', ->
  console.log """

*************************************
*** Currently, for Linux/Mac only ***
*************************************

1. gulp compile --version x.y.z.ddmm
2. gulp dev

Please type 'npm install' in this directory before first use

"""

# compile and zip PmB
gulp.task 'compile-init', ->
  if argv.version is undefined
    throw 'You need to input a version number x.y.z.ddmm'

  initDir compile_path

gulp.task 'compile-main', ['compile-init'], ->
  compileLang 'css', compile_path, compress: true
  compileLang 'html', compile_path
  compileLang 'js', compile_path

gulp.task 'compile-others', ['compile-main'], ->
  compileManifest compile_path, (manifest_json) ->
    manifest_json.version = argv.version

  for file_name in ['font', '_locales', 'license.txt']
    fs.copySync file_name, compile_path + '/' + file_name
  fs.copySync resources_path + '/img', compile_path + '/img'

gulp.task 'compile-zip', ['compile-others'], ->
  gulp.src(compile_path + '/**')
    .pipe(plugins.zip(argv.version + '.zip'))
    .pipe(gulp.dest('.'))

gulp.task 'compile', ['compile-zip'], ->
  rmdirp compile_path # useless after zipped

# create a 'watched' folder for testing
gulp.task 'dev', ->
  initDir dev_path

  watchLang 'css', dev_path
  watchLang 'html', dev_path, pretty: true

  # for js only (no compile, just soft link)
  js_dest_path = dev_path + '/' + lang.js.dest
  rmdirp js_dest_path
  fs.symlinkSync '../' + lang.js.source, js_dest_path

  compileManifest dev_path, (manifest_json) ->
    manifest_json.name += '(dev)'
    manifest_json.version = '0.0.0.0'

  for file_name in ['font', '_locales']
    fs.copySync file_name, dev_path + '/' + file_name
  fs.copySync resources_path + '/img-dev', dev_path + '/img'
