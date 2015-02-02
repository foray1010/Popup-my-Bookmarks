##### Before you start
1. Install [Node.js](https://github.com/joyent/node) or [io.js](https://github.com/iojs/io.js) by:
  - [nvm](https://github.com/creationix/nvm) (Linux/Mac)
  - [Official website](http://nodejs.org/download/) (Windows)

2. Install [gulp.js](https://github.com/gulpjs/gulp)

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

4. md
   > gulp md --make file_name

   To generate markdown file on the current directory
   - __store.md - Description for Chrome Web Store
   - README.md - Description for GitHub
