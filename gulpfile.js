'use strict';

const gulp = require('gulp');

const argv = require('yargs').argv;
const browserify = require('browserify');
const clc = require('cli-color');
const cson = require('cson');
const es = require('event-stream');
const fs = require('fs-extra');
const globby = require('globby');
const path = require('path');
const plugins = require('gulp-load-plugins')();
const vinylSource = require('vinyl-source-stream');
const watchify = require('watchify');

// language config
const lang = {
  css: {
    extName: 'styl',
    compiler: 'stylus',
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
};

// predefined path
const compilePath = '__compile';
const devPath = '__dev';
const resourcesPath = '_resources';

// console print
function printWithTime(msg) {
  const nowTime = new Date().toLocaleTimeString();

  console.log('[' + clc.blackBright(nowTime) + '] ' + msg);
}

// language handlers
function compileLang(langName, destDir, options) {
  const thisLang = lang[langName];

  fs.mkdirsSync(path.join(destDir, thisLang.dest));

  return compileLangHandler(
    thisLang,
    getSourcePath(thisLang),
    destDir,
    options
  );
}

function compileJS(destDir, options) {
  const thisLang = lang.js;

  const entries = globby.sync(getSourcePath(thisLang));

  fs.mkdirsSync(path.join(destDir, thisLang.dest));

  const bundledStreamList = entries.map(function(entry) {
    let b = browserify({
      entries: entry,
      debug: true,
      transform: ['babelify']
    });

    const genBundle = function() {
      const bundledStream = b.bundle()
        .pipe(vinylSource(entry));

      if (!options.watch) {
        const uglifyStream = plugins.streamify(plugins.uglify());
        bundledStream.pipe(uglifyStream);
      }

      return bundledStream
        .pipe(gulp.dest(destDir))
        .on('end', function() {
          printWithTime(clc.magenta(entry) + ' is browserified');
        });
    };

    if (options.watch) {
      b = watchify(b).on('update', genBundle);
    }

    return genBundle();
  });

  return es.concat.apply(null, bundledStreamList);
}

function compileLangHandler(thisLang, sourcePath, destDir, options) {
  const compilerPipe = plugins[thisLang.compiler](options);
  const dest = path.join(destDir, thisLang.dest);

  // printWithTime(clc.magenta(sourcePath) + ' is compiled');

  return gulp.src(sourcePath)
    .pipe(compilerPipe)
    .pipe(gulp.dest(dest))
    .on('end', function() {
      printWithTime(clc.magenta(sourcePath) + ' is compiled');
    });
;
}

function compileManifest(destDir, updateFn) {
  const manifestJSON = cson.load(path.join(resourcesPath, 'manifest.cson'));
  updateFn(manifestJSON);

  const destPath = path.join(destDir, 'manifest.json');
  fs.writeJSONSync(destPath, manifestJSON);
}

function getSourcePath(thisLang) {
  return path.join(thisLang.source, '*.' + thisLang.extName);
}

function watchLang(langName, destDir, options) {
  const thisLang = lang[langName];

  gulp.watch(getSourcePath(thisLang), function(event) {
    compileLangHandler(thisLang, event.path, destDir, options);
  });

  return compileLang(langName, destDir, options);
}

// markdown handler
function getMarkdownData(titleList) {
  const mdSource = path.join(resourcesPath, 'markdown');

  const dataList = [];
  titleList.forEach(function(title) {
    const fileData = fs.readFileSync(
      path.join(mdSource, `${title}.md`), 'utf-8'
    );

    dataList.push(
      `## ${title}` +
      '\n\n' +
      fileData
    );
  });

  return dataList.join('\n\n');
}

// initiate the output folder
function initDir(dirPath) {
  fs.removeSync(dirPath);
  fs.mkdirSync(dirPath);
}

// default when no task
gulp.task('default', ['help']);

// user guideline
gulp.task('help', function() {
  console.log('\n' + getMarkdownData(['Developer guide']) + '\n');
});

// compile and zip PmB
gulp.task('compile-init', function() {
  const version = argv.version;

  const versionCheck = function(x) {
    return (
      x === `${parseInt(x, 10)}` &&
      x >= 0 &&
      x <= 65535
    );
  };

  if (version === undefined ||
      typeof version !== 'string' ||
      version.split('.').length !== 4 ||
      !version.split('.').every(versionCheck)) {
    throw Error('You need to input a version number x.y.z.ddmm, ' +
      'each number between 0 - 65535');
  }

  initDir(compilePath);
});

gulp.task('compile-css', ['compile-init'], function() {
  return compileLang('css', compilePath, {compress: true});
});

gulp.task('compile-html', ['compile-init'], function() {
  return compileLang('html', compilePath);
});

gulp.task('compile-js', ['compile-init'], function() {
  return compileJS(compilePath, {watch: false});
});

gulp.task('compile-others', ['compile-init'], function() {
  const fileList = ['font', '_locales', 'LICENSE'];

  fileList.forEach(function(fileName) {
    fs.copySync(fileName, path.join(compilePath, fileName));
  });
  fs.copySync(path.join(resourcesPath, 'img'), path.join(compilePath, 'img'));

  compileManifest(compilePath, function(manifestJSON) {
    manifestJSON.version = argv.version;
  });
});

gulp.task('compile-zip', [
            'compile-css',
            'compile-html',
            'compile-js',
            'compile-others'
          ], function() {
  return gulp.src(path.join(compilePath, '**'))
    .pipe(plugins.zip(argv.version + '.zip'))
    .pipe(gulp.dest('.'));
});

gulp.task('compile', ['compile-zip'], function() {
  // useless after zipped
  fs.removeSync(compilePath);
});

// create a 'watched' folder for testing
gulp.task('dev', function() {
  initDir(devPath);

  watchLang('css', devPath);
  watchLang('html', devPath, {pretty: true});
  compileJS(devPath, {watch: true});

  const fileList = ['font', '_locales'];

  fileList.forEach(function(fileName) {
    fs.symlinkSync(
      path.join('..', fileName),
      path.join(devPath, fileName),
      'dir'
    );
  });
  fs.symlinkSync(
    path.join('..', resourcesPath, 'img-dev'),
    path.join(devPath, 'img'),
    'dir'
  );

  compileManifest(devPath, function(manifestJSON) {
    manifestJSON.name += '(dev)';
    manifestJSON.version = '0.0.0.0';
  });
});

// Lints
gulp.task('lint-css', function() {
  return gulp.src(path.join(lang.css.source, '*'))
    .pipe(plugins.stylint());
});

gulp.task('lint-js', function() {
  return gulp.src([
    'gulpfile.js',
    path.join(lang.js.source, '**')
  ])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('lint', ['lint-css', 'lint-js']);

// generate markdown file
gulp.task('md', function() {
  const fileName = argv.make;

  let fileData;

  switch (fileName) {
    case '__store.md':
      fileData = getMarkdownData([
        'Popup my Bookmarks',
        'Plan to do',
        'What you can help',
        'FAQ'
      ]);

      // remove first three lines
      fileData = fileData.replace(/.+\n\n.+\n/, '');

      // remove style of subheader
      fileData = fileData.replace(/##### /g, '');

      break;

    case 'README.md':
      fileData = getMarkdownData([
        'Popup my Bookmarks',
        'Developer guide',
        'Plan to do',
        'What you can help',
        'FAQ'
      ]);

      // enlarge first header
      fileData = fileData.replace(/^##/, '#');

      break;

    default:
      throw Error(`Unknown markdown file: ${fileName}`);
  }

  fs.writeFile(fileName, fileData);
});
