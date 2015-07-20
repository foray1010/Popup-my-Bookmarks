# Popup my Bookmarks

[Popup my Bookmarks](//chrome.google.com/webstore/detail/popup-my-bookmarks/mppflflkbbafeopeoeigkbbdjdbeifni) is a Chrome extension aims at providing a more efficient way to view and manage your bookmarks menu:
- Firefox / IE-like bookmarks menu

- Display bookmark trees side by side

- It is configurable!

- Search bookmarks when you type

- Do what Bookmark manager can do and more (e.g., Sort bookmarks by name, Add separator)

- Save 24px of your vertical workspace (Rock on Chromebook!)

- No background running application, save your memory and privacy!

Changelog: https://github.com/foray1010/Popup-my-Bookmarks/blob/master/CHANGELOG.md


## Developer guide

##### Before you start
1. Install [io.js](//github.com/iojs/io.js) (or [Node.js](//github.com/joyent/node) with no guarantee) via:
  - [nvm](//github.com/creationix/nvm) (Linux/Mac)
  - [io.js official website](//iojs.org) (Windows)

2. Install [gulp.js](//github.com/gulpjs/gulp)

  ```
  npm install -g gulp
  ```

3. **cd** to your workspace and install all dependencies

  ```
  npm install
  ```

##### Commands
1. compile

  ```
  gulp compile --version x.y.z.ddmm
  ```

  To compile the whole extension and output a zip file for uploading to Chrome Web Store

2. dev

  ```
  gulp dev
  ```

  To make a temporary folder `__dev` for you to load unpacked extension
  - ES6 JavaScript to ES5 JavaScript by [Babel](//github.com/babel/babel)
  - *.styl to *.css by [Stylus](//github.com/stylus/stylus)
  - *.jade to *.html by [Jade](//github.com/jadejs/jade)

3. help

  ```
  gulp help
  ```

  Display developer guide on terminal

4. lint

  ```
  gulp lint
  ```

  To lint
  - ES6 JavaScript code by [ESLint](//github.com/eslint/eslint)
  - Stylus code by [Stylint](//github.com/rossPatton/stylint)

5. md

  ```
  gulp md --make <file_name>
  ```

  To generate markdown file on the current directory
  - `__store.md` - Description for Chrome Web Store
  - `README.md` - Description for GitHub


## Todo

1. Bookmarks selector (allow drag and manage a group of bookmarks)


## Contributing

- Translate to other languages, It's all depended on volunteers as I am not a linguist. ;-)

  Please join our translation team on http://goo.gl/ZET77

- Fork me on GitHub, join our development!

  Repo: https://github.com/foray1010/Popup-my-Bookmarks


## FAQ

##### Why does PmB need to `Access your tabs and browsing activity` and `Access your data on all websites`(optional)?

- `Add current page` and `Open bookmark in tab` require permission - `Access your tabs and browsing activity`

- `Bookmarklet support`(optional) requires permission - `Access your data on all websites`(optional)
