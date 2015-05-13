##### Before you start
1. Install [io.js](//github.com/iojs/io.js) (or [Node.js](//github.com/joyent/node) with no guarantee) via:
  - [nvm](//github.com/creationix/nvm) (Linux/Mac)
  - [io.js official website](//iojs.org) (Windows)

2. Install [gulp.js](//github.com/gulpjs/gulp)

   > npm install -g gulp

3. **cd** to your workspace and install all dependencies
   > cd ~/Popup-my-Bookmarks
   >
   > npm install

##### Commands
1. compile
   > gulp compile --version x.y.z.ddmm

   To compile the whole extension and output a zip file for uploading to Chrome Web Store

2. dev
   > gulp dev

   To make a temporary folder "__dev" for you to load unpacked extension
   - *.styl and *.jade will be watched and compiled to *.css or *.html once you edit
   - "__dev/js" will be soft-linked to "./js"

3. help
   > gulp help

   Display developer guide on terminal

4. lint
   > gulp lint

   To lint
   - JavaScript code by [JSHint](//github.com/jshint/jshint)
   - CoffeeScript code by [CoffeeLint](//github.com/clutchski/coffeelint)
   - Stylus code by [Stylint](//github.com/rossPatton/stylint)

5. md
   > gulp md --make file_name

   To generate markdown file on the current directory
   - __store.md - Description for Chrome Web Store
   - README.md - Description for GitHub
