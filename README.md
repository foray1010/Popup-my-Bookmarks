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

- Take as few permissions as possible, no more scary permissions!

- No background running application, save your memory and privacy!

Changelog: https://github.com/foray1010/Popup-my-Bookmarks/blob/master/CHANGELOG.md


## Legacy version

Please visit [here](https://github.com/foray1010/Popup-my-Bookmarks/tree/minimum_chrome_version_26) for the legacy version that support Chrome 26


## Developer guide

##### Before you start
1. Install [Node.js](//github.com/nodejs/node) (version >= 8.9) via:
  - [nvm](//github.com/creationix/nvm) (Linux/Mac)
  - [Node.js official website](//nodejs.org/en/download/) (Windows)

2. Install [yarn](https://github.com/yarnpkg/yarn)

  ```
  npm install -g yarn
  ```

3. `cd` to your workspace and install all dependencies

  ```
  yarn install
  ```

##### Commands
1. build

  ```
  yarn build
  ```

  To build the whole extension and output a zip file (./__build/[version in package.json].zip) for uploading to Chrome Web Store

2. dev

  ```
  yarn dev
  ```

  To make a temporary folder `__dev` for you to load unpacked extension
  - ES2015-2017 JavaScript to ES5 JavaScript by [Babel](//github.com/babel/babel)
  - CSS4 to CSS3 by [postcss-cssnext](//github.com/MoOx/postcss-cssnext)
  - *.pug to *.html by [Pug](//github.com/pugjs/pug)

3. lint

  ```
  yarn lint
  ```

  To lint
  - ES2015-2017 JavaScript code by [ESLint](//github.com/eslint/eslint)
  - flowtype by [flow](//github.com/facebook/flow)
  - CSS4 code by [Stylelint](//github.com/stylelint/stylelint)

4. md

  ```
  yarn md
  ```

  To generate markdown file on the current directory
  - `__store.md` - Description for Chrome Web Store
  - `README.md` - Description for GitHub


## Todo & Working Progress

See https://trello.com/b/bREPCfDk/popup-my-bookmarks


## Contributing

- Translate to other languages, It's all depended on volunteers as I am not a linguist. ;-)

  Please join our translation team on https://goo.gl/ZET77

- Fork me on GitHub, join our development!

  Repo: https://github.com/foray1010/Popup-my-Bookmarks
