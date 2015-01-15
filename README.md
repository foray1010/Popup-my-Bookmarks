# Popup my Bookmarks
Popup my Bookmarks is a Chrome extension aims at providing a more efficient way to view and manage your bookmarks menu:

- Firefox / IE-like bookmarks menu

- Display bookmark trees side by side

- It is configurable!

- Search bookmarks with Advanced Searching Algorithm!

- Do what Bookmark manager can do and more (e.g., Sort bookmarks by name, Add separator)

- Save 24px of your vertical workspace (Rock on Chromebook!)

- No background running application, save your memory and privacy!

## Developer guide
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

   To compile the whole extension and output a zip file for uploading to Chrome extension store

2. dev
   > gulp dev

   To make a temporary folder "__dev" for you to load unpacked extension
   - *.styl and *.jade will be watched and compiled to *.css or *.html once you edit
   - "__dev/js" will be soft-linked to "./js"

## Plan to do:

1. Keyboard Navigation

2. Bookmarks selector (allow drag and manage a group of bookmarks)


## What you can help:

- Translate to other languages, It's all depended on volunteers as I am not a linguist. ;-)

  Please join our translation team on http://goo.gl/ZET77

- Fork me on GitHub, join our development!

  Repo: https://github.com/foray1010/Popup-my-Bookmarks


## Why does PmB need to 'Access your tabs and browsing activity' and 'Access your data on all websites'(optional)?

- 'Add current page' and 'Open bookmark in tab' require permission - 'Access your tabs and browsing activity'

- 'Bookmarklet support'(optional) requires permission - 'Access your data on all websites'(optional)
