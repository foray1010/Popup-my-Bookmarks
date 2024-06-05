# Popup my Bookmarks

[![Version On Chrome Web Store](https://img.shields.io/chrome-web-store/v/mppflflkbbafeopeoeigkbbdjdbeifni.svg?maxAge=3600)](https://chromewebstore.google.com/detail/popup-my-bookmarks/mppflflkbbafeopeoeigkbbdjdbeifni)
[![Download Count On Chrome Web Store](https://img.shields.io/chrome-web-store/d/mppflflkbbafeopeoeigkbbdjdbeifni.svg?maxAge=3600)](https://chromewebstore.google.com/detail/popup-my-bookmarks/mppflflkbbafeopeoeigkbbdjdbeifni)
[![Build Status](https://img.shields.io/circleci/project/foray1010/Popup-my-Bookmarks/master.svg?maxAge=3600)](https://circleci.com/gh/foray1010/Popup-my-Bookmarks/tree/master)

[Popup my Bookmarks](https://chromewebstore.google.com/detail/popup-my-bookmarks/mppflflkbbafeopeoeigkbbdjdbeifni) is a Chrome extension aims at providing a more efficient way to view and manage your bookmarks menu:

- Firefox / IE-like bookmarks menu

- Place mouse over folders to open it

- Search bookmarks when you type

- Do what Bookmark manager can do and more (e.g., Sort bookmarks by name, Add separator)

- Highly configurable

- Save 24px of your vertical workspace (Rock on Chromebook!)

- Take as few permissions as possible, we never put your privacy at risk

- No background running application, save computer memory and your privacy!

Changelog: <https://github.com/foray1010/Popup-my-Bookmarks/blob/master/CHANGELOG.md>

## Legacy version

Please visit following branches for the legacy versions that support older version of Chrome

- [>= Chrome 64](https://github.com/foray1010/Popup-my-Bookmarks/tree/minimum_chrome_version_64)
- [>= Chrome 55](https://github.com/foray1010/Popup-my-Bookmarks/tree/minimum_chrome_version_55)
- [>= Chrome 34](https://github.com/foray1010/Popup-my-Bookmarks/tree/minimum_chrome_version_34)
- [>= Chrome 26](https://github.com/foray1010/Popup-my-Bookmarks/tree/minimum_chrome_version_26)
- [>= Chrome 20](https://github.com/foray1010/Popup-my-Bookmarks/tree/minimum_chrome_version_20)

## Developer guide

### Before you start

1. We are using [corepack](https://nodejs.org/api/corepack.html) to manage the `yarn` version

   ```sh
   corepack enable
   ```

1. `cd` to your workspace and install all dependencies

   ```sh
   yarn install
   ```

### Commands

1. build

   ```sh
   make build
   ```

   To build the whole extension and output a zip file (./build/production/{version_in_package.json}.zip) for uploading to Chrome Web Store

1. dev

   ```sh
   make dev
   ```

   To build a temporary folder `build/development` for loading unpacked extension

1. lint

   ```sh
   make lint
   ```

   To lint if all files follow our linter config

1. locales

   ```sh
   make locales
   ```

   To download the latest locale files from transifex

   - `build/store.md` - Description for Chrome Web Store
   - `README.md` - Description for GitHub

1. md

   ```sh
   make md
   ```

   To generate markdown files

   - `build/store.md` - Description for Chrome Web Store
   - `README.md` - Description for GitHub

## Todo & Working Progress

See <https://trello.com/b/bREPCfDk/popup-my-bookmarks>

## Contributing

- Translate to other languages. It's all depended on volunteers as I am not a linguist. ;-)

  Please join our translation team on <https://explore.transifex.com/foray1010/popup-my-bookmarks/>

- Fork me on GitHub, join our development!

  Repo: <https://github.com/foray1010/Popup-my-Bookmarks>
