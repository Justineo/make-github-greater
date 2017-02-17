var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var run = require('run-sequence');
var merge = require('merge-stream');
var del = require('del');
var exec = require('child_process').exec;
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var plist = require('plist');
var pack = require('./package.json');
var version = pack.version;

function getCommentHandler() {
  var inMetaBlock = false;
  return function (node, comment) {
    var value = comment.value.trim();
    if (comment.type === 'comment2' && value.charAt(0) === '!') {
      return true;
    }
    if (value === '==UserScript==') {
      inMetaBlock = true;
      return true;
    }
    if (value === '==/UserScript==') {
      inMetaBlock = false;
      return true;
    }
    return inMetaBlock;
  }
}

gulp.task('userscript:prepare', function () {
  var main = gulp.src('./main.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(rename('main.userscript.js'))
    .pipe(gulp.dest('./tmp'));
  var meta = gulp.src('./userscript/src/metadata.js')
    .pipe(replace('{{version}}', version))
    .pipe(gulp.dest('./tmp'));
  return merge(main, meta);
});

gulp.task('userscript', ['userscript:prepare'], function () {
  var inMetaBlock = false;
  return gulp.src([
      './tmp/metadata.js',
      './src/kolor.js',
      './tmp/main.userscript.js'
    ])
    .pipe(concat('make-github-greater.user.js'))
    .pipe(uglify({
      preserveComments: getCommentHandler()
    }))
    .pipe(gulp.dest('./userscript/dist'));
});

gulp.task('chrome:cp', function () {
  var manifestPath = './extensions/chrome/manifest.json';
  var manifest = JSON.parse(fs.readFileSync(manifestPath, { encoding: 'utf8' }));
  manifest.version = version;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, '  '));

  var targets = [
    './src/*', './icon.png'
  ];
  return gulp.src(targets)
    .pipe(gulp.dest('./extensions/chrome'));
});

gulp.task('safari:cp', function () {
  var infoPath = './extensions/make-github-greater.safariextension/Info.plist';
  var info = plist.parse(fs.readFileSync(infoPath, { encoding: 'utf8' }));
  info.CFBundleShortVersionString = version;
  info.CFBundleVersion = version;
  fs.writeFileSync(infoPath, plist.build(info));

  var targets = [
    './src/*', './icon.png'
  ];
  return gulp.src(targets)
    .pipe(gulp.dest('./extensions/make-github-greater.safariextension'));
});

gulp.task('edge:cp', function () {
  var manifestPath = './extensions/edge/manifest.json';
  var manifest = JSON.parse(fs.readFileSync(manifestPath, { encoding: 'utf8' }));
  manifest.version = version;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, '  '));

  var targets = [
    './src/*', './icon.png'
  ];
  return gulp.src(targets)
    .pipe(gulp.dest('./extensions/edge'));
});

gulp.task('firefox:cp', function () {
  var fxPackPath = './extensions/firefox/package.json';
  var fxPack = JSON.parse(fs.readFileSync(fxPackPath, { encoding: 'utf8' }));
  fxPack.version = version;
  fs.writeFileSync(fxPackPath, JSON.stringify(fxPack, null, '  '));

  return gulp.src(['./src/*', './icon.png'])
    .pipe(gulp.dest('./extensions/firefox/data'));
});

gulp.task('chrome:zip', ['chrome:cp'], function (cb) {
  exec(
    'find . -path \'*/.*\' -prune -o -type f -print | zip ../packed/make-github-greater.chrome.zip -@',
    { cwd: 'extensions/chrome' },
    function (error, stdout, stderr) {
      if (error) {
        return cb(error);
      } else {
        cb();
      }
    }
  );
});

gulp.task('edge:zip', ['edge:cp'], function (cb) {
  exec(
    'find . -path \'*/.*\' -prune -o -type f -print | zip ../packed/make-github-greater.edge.zip -@',
    { cwd: 'extensions/edge' },
    function (error, stdout, stderr) {
      if (error) {
        return cb(error);
      } else {
        cb();
      }
    }
  );
});

gulp.task('firefox:xpi', ['firefox:cp'], function (cb) {
  exec('jpm xpi', {
    cwd: 'extensions/firefox'
  }, function (error, stdout, stderr) {
    if (error) {
      return cb(error);
    } else {
      fs.renameSync('./extensions/firefox/@' + pack.name + '-' + version + '.xpi', './extensions/packed/' + pack.name + '.xpi');
      cb();
    }
  });
});

gulp.task('opera:nex', ['chrome:zip'], function (cb) {
  exec(''
    + '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"'
    + ' --pack-extension=' + path.join(__dirname, 'extensions/chrome')
    + ' --pack-extension-key=' + path.join(process.env.HOME, '.ssh/chrome.pem'),
    function (error, stdout, stderr) {
      if (error) {
        return cb(error);
      } else {
        fs.renameSync('./extensions/chrome.crx', './extensions/packed/make-github-greater.nex');
        cb();
      }
    }
  );
});

gulp.task('cleanup', function (cb) {
  return del(['./tmp']);
});

gulp.task('extensions', ['chrome:zip', 'edge:zip', 'firefox:xpi', 'opera:nex', 'safari:cp']);
gulp.task('build', ['extensions', 'userscript']);
gulp.task('default', function (cb) {
  run('build', 'cleanup', cb);
});
