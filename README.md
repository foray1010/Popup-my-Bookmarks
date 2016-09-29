# Popup my Bookmarks

[![Version On Chrome Web Store](https://img.shields.io/chrome-web-store/v/mppflflkbbafeopeoeigkbbdjdbeifni.svg?maxAge=3600)](//chrome.google.com/webstore/detail/popup-my-bookmarks/mppflflkbbafeopeoeigkbbdjdbeifni)
[![Download Count On Chrome Web Store](https://img.shields.io/chrome-web-store/d/mppflflkbbafeopeoeigkbbdjdbeifni.svg?maxAge=3600)](//chrome.google.com/webstore/detail/popup-my-bookmarks/mppflflkbbafeopeoeigkbbdjdbeifni)

[![Build Status](https://img.shields.io/circleci/project/foray1010/Popup-my-Bookmarks/master.svg?maxAge=3600)](//circleci.com/gh/foray1010/Popup-my-Bookmarks/tree/master)
[![Dependency Status](https://img.shields.io/gemnasium/foray1010/Popup-my-Bookmarks.svg?maxAge=3600)](//gemnasium.com/foray1010/Popup-my-Bookmarks)

[Popup my Bookmarks](//chrome.google.com/webstore/detail/popup-my-bookmarks/mppflflkbbafeopeoeigkbbdjdbeifni) is a Chrome extension aims at providing a more efficient way to view and manage your bookmarks menu:


- Firefox / IE-like bookmarks menu

- Display bookmark trees side by side

- It is configurable!

- Search bookmarks when you type

- Do what Bookmark manager can do and more (e.g., Sort bookmarks by name, Add separator)

- Save 24px of your vertical workspace (Rock on Chromebook!)

- No background running application, save your memory and privacy!

Changelog: https://github.com/foray1010/Popup-my-Bookmarks/blob/master/CHANGELOG.md


## Stable version

Please visit [here](https://github.com/foray1010/Popup-my-Bookmarks/tree/minimum_chrome_version_26) for the stable version that is currently using in Chrome Extension Store


## Developer guide

##### Before you start
1. Install [Node.js](//github.com/nodejs/node) (version >= 4.2) via:
  - [nvm](//github.com/creationix/nvm) (Linux/Mac)
  - [Node.js official website](//nodejs.org/en/download/) (Windows)

2. **cd** to your workspace and install all dependencies

  ```
  npm install
  ```

##### Commands
1. build

  ```
  npm run build
  ```

  To build the whole extension and output a zip file ([version in package.json].zip) for uploading to Chrome Web Store

2. dev

  ```
  npm run dev
  ```

  To make a temporary folder `__dev` for you to load unpacked extension
  - ES6 JavaScript to ES5 JavaScript by [Babel](//github.com/babel/babel)
  - CSS4 to CSS3 by [postcss-cssnext](//github.com/MoOx/postcss-cssnext)
  - *.pug to *.html by [Pug](//github.com/pugjs/pug)

3. help

  ```
  npm run help
  ```

  Display developer guide on terminal

4. lint

  ```
  npm run lint
  ```

  To lint
  - ES6 JavaScript code by [ESLint](//github.com/eslint/eslint)
  - CSS4 code by [Stylelint](//github.com/stylelint/stylelint)

5. md

  ```
  npm run md
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
