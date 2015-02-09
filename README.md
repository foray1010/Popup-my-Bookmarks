## Popup my Bookmarks

Popup my Bookmarks is a Chrome extension aims at providing a more efficient way to view and manage your bookmarks menu:
- Firefox / IE-like bookmarks menu

- Display bookmark trees side by side

- It is configurable!

- Search bookmarks when you type

- Do what Bookmark manager can do and more (e.g., Sort bookmarks by name, Add separator)

- Save 24px of your vertical workspace (Rock on Chromebook!)

- No background running application, save your memory and privacy!


## Developer guide

##### Before you start
1. Install [Node.js](//github.com/joyent/node) or [io.js](//github.com/iojs/io.js) via:
  - [nvm](//github.com/creationix/nvm) (Linux/Mac)
  - [Node.js](//nodejs.org/download) or [io.js](//iojs.org) official website (Windows)

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

4. md
   > gulp md --make file_name

   To generate markdown file on the current directory
   - __store.md - Description for Chrome Web Store
   - README.md - Description for GitHub


## Plan to do

1. Keyboard Navigation

2. Bookmarks selector (allow drag and manage a group of bookmarks)


## What you can help

- Translate to other languages, It's all depended on volunteers as I am not a linguist. ;-)

  Please join our translation team on http://goo.gl/ZET77

- Fork me on GitHub, join our development!

  Repo: https://github.com/foray1010/Popup-my-Bookmarks


## Q&A

##### Why does PmB need to 'Access your tabs and browsing activity' and 'Access your data on all websites'(optional)?

- 'Add current page' and 'Open bookmark in tab' require permission - 'Access your tabs and browsing activity'

- 'Bookmarklet support'(optional) requires permission - 'Access your data on all websites'(optional)
