gulp = require 'gulp'

argv = require('yargs').argv
fs = require 'fs-extra'
path = require 'path'
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


# language handlers
compileLang = (lang_name, dest_dir, options) ->
  this_lang = lang[lang_name]

  fs.mkdirsSync path.join(dest_dir, this_lang.dest)

  compileLangHandler this_lang, getSourcePath(this_lang), dest_dir, options
compileLangHandler = (this_lang, source_path, dest_dir, options) ->
  gulp.src source_path
    .pipe plugins[this_lang.plugin](options)
    .pipe gulp.dest(path.join(dest_dir, this_lang.dest))
compileManifest = (dest_dir, update_fn) ->
  manifest_json = yamljs.load path.join(resources_path, 'manifest.yml')
  update_fn manifest_json

  dest_path = path.join dest_dir, 'manifest.json'
  fs.writeJSONSync dest_path, manifest_json
getSourcePath = (this_lang) -> path.join this_lang.source, '*.' + this_lang.extName
watchLang = (lang_name, dest_dir, options) ->
  this_lang = lang[lang_name]

  compileLang lang_name, dest_dir, options

  gulp.watch getSourcePath(this_lang), (event) ->
    compileLangHandler this_lang, event.path, dest_dir, options

# markdown handler
getMarkdownData = (title_list) ->
  md_source = path.join resources_path, 'markdown'

  data_list = []
  for title in title_list
    file_data = fs.readFileSync path.join(md_source, "#{title}.md"), 'utf-8'
    data_list.push """
## #{title}

#{file_data}
"""

  return data_list.join '\n\n'

# initiate the output folder
initDir = (dir_path) ->
  fs.removeSync dir_path
  fs.mkdirSync dir_path


# default when no task
gulp.task 'default', ['help']


# user guideline
gulp.task 'help', ->
  console.log '\n' + getMarkdownData(['Developer guide']) + '\n'


# compile and zip PmB
gulp.task 'compile-init', ->
  if argv.version is undefined or
     argv.version.split('.').length isnt 4 or
     not argv.version.split('.').every((x) -> x is "#{parseInt x}" and 0 <= x <= 65535)
    throw 'You need to input a version number x.y.z.ddmm, each number between 0 - 65535'

  initDir compile_path

gulp.task 'compile-main', ['compile-init'], ->
  compileLang 'css', compile_path, compress: true
  compileLang 'html', compile_path
  compileLang 'js', compile_path

gulp.task 'compile-others', ['compile-init'], ->
  for file_name in ['font', '_locales', 'LICENSE']
    fs.copySync file_name, path.join(compile_path, file_name)
  fs.copySync path.join(resources_path, 'img'), path.join(compile_path, 'img')

  compileManifest compile_path, (manifest_json) ->
    manifest_json.version = argv.version

gulp.task 'compile-zip', ['compile-main', 'compile-others'], ->
  gulp.src path.join(compile_path, '**')
    .pipe plugins.zip(argv.version + '.zip')
    .pipe gulp.dest('.')

gulp.task 'compile', ['compile-zip'], ->
  fs.removeSync compile_path # useless after zipped


# create a 'watched' folder for testing
gulp.task 'dev', ->
  initDir dev_path

  watchLang 'css', dev_path
  watchLang 'html', dev_path, pretty: true

  for file_name in ['font', '_locales', lang.js.source]
    fs.symlinkSync path.join('..', file_name), path.join(dev_path, file_name), 'dir'
  fs.symlinkSync path.join('..', resources_path, 'img-dev'), path.join(dev_path, 'img'), 'dir'

  compileManifest dev_path, (manifest_json) ->
    manifest_json.name += '(dev)'
    manifest_json.version = '0.0.0.0'


# generate markdown file
gulp.task 'md', ->
  file_name = argv.make

  switch file_name
    when '__store.md'
      file_data = getMarkdownData([
        'Popup my Bookmarks'
        'Plan to do'
        'What you can help'
        'FAQ'
      ])

      # remove first three lines
      file_data = file_data.replace /.+\n\n.+\n/, ''

      # remove style of subheader
      file_data = file_data.replace /##### /g, ''

    when 'README.md'
      file_data = getMarkdownData([
        'Popup my Bookmarks'
        'Developer guide'
        'Plan to do'
        'What you can help'
        'FAQ'
      ])

      # enlarge first header
      file_data = file_data.replace /^##/, '#'

    else
      throw "Unknown markdown file: #{file_name}"

  fs.writeFile file_name, file_data


# jshint
gulp.task 'test', ->
  gulp.src path.join(lang.js.source, '*')
    .pipe plugins.jshint()
    .pipe plugins.jshint.reporter('jshint-stylish')
