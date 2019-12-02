# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [7.0.0](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.2.1...v7.0.0) (2019-12-02)

### ⚠ BREAKING CHANGES

- require chrome version >= 64

### Features

- support dark mode ([9100419](https://github.com/foray1010/Popup-my-Bookmarks/commit/910041934c6c976e77dce9fdb6434174adc9a593))

### Bug Fixes

- **deps:** update dependency @rehooks/component-size to v1.0.3 ([16ffd0e](https://github.com/foray1010/Popup-my-Bookmarks/commit/16ffd0e6c27f90685b4b0d43a366084e8fd09af1))
- **deps:** update dependency core-js to v3.2.1 ([e90aaaa](https://github.com/foray1010/Popup-my-Bookmarks/commit/e90aaaa649a9aee52080797d9143d772455cc2ca))
- **deps:** update dependency core-js to v3.3.2 ([274e40c](https://github.com/foray1010/Popup-my-Bookmarks/commit/274e40c728f0b7aa38c81a6c751c88db170405fa))
- **deps:** update dependency core-js to v3.3.4 ([#745](https://github.com/foray1010/Popup-my-Bookmarks/issues/745)) ([30de0f2](https://github.com/foray1010/Popup-my-Bookmarks/commit/30de0f243dce465c4c0f6372fc9e7313ad5cd532))
- **deps:** update dependency core-js to v3.3.6 ([91dc7d8](https://github.com/foray1010/Popup-my-Bookmarks/commit/91dc7d8cd4ca52ce5a3b886020a678f3669ff22c))
- **deps:** update dependency core-js to v3.4.0 ([80119cb](https://github.com/foray1010/Popup-my-Bookmarks/commit/80119cb0c51c58b65f74722dfadb04909dc53488))
- **deps:** update dependency core-js to v3.4.5 ([0a6278f](https://github.com/foray1010/Popup-my-Bookmarks/commit/0a6278fd0eacd6bc93e799864c2d0362e17bbc59))
- **deps:** update dependency nanoid to v2.0.4 ([e529a5a](https://github.com/foray1010/Popup-my-Bookmarks/commit/e529a5a104ae976f1e7b7d45fb205aa4c70eac0f))
- **deps:** update dependency nanoid to v2.1.0 ([0d3d087](https://github.com/foray1010/Popup-my-Bookmarks/commit/0d3d0876f1f452712dfa68d6c0274034a82f453f))
- **deps:** update dependency nanoid to v2.1.1 ([041633b](https://github.com/foray1010/Popup-my-Bookmarks/commit/041633bfffd42ee110e21e0c6b573d456772575c))
- **deps:** update dependency nanoid to v2.1.3 ([1f0f249](https://github.com/foray1010/Popup-my-Bookmarks/commit/1f0f2497b2f86cbcbf5e2ce84c5422a6e414c1c3))
- **deps:** update dependency nanoid to v2.1.4 ([5812159](https://github.com/foray1010/Popup-my-Bookmarks/commit/5812159f69267d3e07f0fc5ae1bf6fcf9cfa0fbc))
- **deps:** update dependency nanoid to v2.1.6 ([26f6b6e](https://github.com/foray1010/Popup-my-Bookmarks/commit/26f6b6e4186e32c933a1abf899cca5e1b0a8d7ce))
- **deps:** update dependency react-redux to v7.1.3 ([70f8477](https://github.com/foray1010/Popup-my-Bookmarks/commit/70f8477970af79acb4c72e77a592a3fa802308e2))
- **deps:** update dependency redux-saga to v1.1.1 ([#689](https://github.com/foray1010/Popup-my-Bookmarks/issues/689)) ([8915c11](https://github.com/foray1010/Popup-my-Bookmarks/commit/8915c1194da0f47679e8acb68b6510ae52a46b23))
- **deps:** update dependency redux-saga to v1.1.3 ([7fd8888](https://github.com/foray1010/Popup-my-Bookmarks/commit/7fd888870e0cf65b83697d798bea607d67c7abf6))
- **deps:** update dependency typesafe-actions to v5 ([#761](https://github.com/foray1010/Popup-my-Bookmarks/issues/761)) ([77bb6f9](https://github.com/foray1010/Popup-my-Bookmarks/commit/77bb6f9617f89dbae7db5c9fa8a3d159a2e7b975))
- **deps:** update dependency webextension-polyfill to v0.5.0 ([c5f53f8](https://github.com/foray1010/Popup-my-Bookmarks/commit/c5f53f8131d41c0be5249ef5bb7cc63fbe8ea0e1))
- **deps:** update react monorepo to v16.10.1 ([93d7a75](https://github.com/foray1010/Popup-my-Bookmarks/commit/93d7a750f4842f60defdcf7403c259d3caba38b2))
- **deps:** update react monorepo to v16.11.0 ([6055d4c](https://github.com/foray1010/Popup-my-Bookmarks/commit/6055d4c28351ce5a494b7a28c40e0e645c80fe63))

* drop ResizeObserver polyfill ([abd13d7](https://github.com/foray1010/Popup-my-Bookmarks/commit/abd13d738902bf573dee2fa636a52d3363ccf972))

### [6.2.1](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.2.0...v6.2.1) (2019-07-15)

### Bug Fixes

- properly polyfill ResizeObserver on chrome < 64 ([dd4dd5a](https://github.com/foray1010/Popup-my-Bookmarks/commit/dd4dd5a))

## [6.2.0](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.1.0...v6.2.0) (2019-07-06)

### Features

- support ctrl/cmd/shift modifier when opening bookmark via keyboard ([2d92927](https://github.com/foray1010/Popup-my-Bookmarks/commit/2d92927))

## [6.1.0](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.0.3...v6.1.0) (2019-05-19)

### Features

- always show cancel search button even not focusing on search (reported by [@dlbryant](https://github.com/dlbryant)) ([fe0a0c4](https://github.com/foray1010/Popup-my-Bookmarks/commit/fe0a0c4))
- avoid duplicated separator URL (suggested by [@dlbryant](https://github.com/dlbryant)) ([e7f605c](https://github.com/foray1010/Popup-my-Bookmarks/commit/e7f605c))
- increase separator width to fit the largest popup width ([c114f94](https://github.com/foray1010/Popup-my-Bookmarks/commit/c114f94))

## [6.0.3](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.0.2...v6.0.3) (2019-05-18)

### Bug Fixes

- cannot drag on the edge of the bookmark ([1ad980e](https://github.com/foray1010/Popup-my-Bookmarks/commit/1ad980e))

## [6.0.2](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.0.1...v6.0.2) (2019-05-18)

### Bug Fixes

- should not trigger dragging when clicking bookmark with a shaking hand (reported by [@dlbryant](https://github.com/dlbryant)) ([e2e8265](https://github.com/foray1010/Popup-my-Bookmarks/commit/e2e8265))

## [6.0.1](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.0.0...v6.0.1) (2019-05-17)

### Bug Fixes

- close PmB by pressing Esc on input w/o value (reported by [@alon91](https://github.com/alon91)) ([0472fe0](https://github.com/foray1010/Popup-my-Bookmarks/commit/0472fe0))
- should search immediately by pressing any key (reported by [@alon91](https://github.com/alon91)) ([f0fb879](https://github.com/foray1010/Popup-my-Bookmarks/commit/f0fb879))

## 6.0.0 (15/05/2019)

### Improvements

- rewrite the whole extension with better structure, very likely with fewer bugs
- reduce file size and improve startup speed by removing unnecessary polyfills such as `promise` and `regenerator`
- reduce file size by using `woff2` instead of `woff`

### Changes

- increase minimum Chrome version from 34 to 55
- new folder, search and cancel icons

### Bug Fixes

- some bookmark rows may not have correct height after sorting/adding/deleting bookmarks
- should not allow paste when searching
- cannot drop bookmark when dragging
- input cursor moved to the end after inputting multiple whitespace

### Translations

- support Swedish locale (thanks Bosse Johansson)
- locales update: Norwegian Bokmål(Bjorn Tore Asheim)

## 5.3.2 (30/03/2019)

### Bug Fixes

- keep resizing in options page with long option description (reported by @silou)

## 5.3.1 (1/10/2018)

### Changes

- Revert "do not close window after pressing Esc"

## 5.3.0 (29/9/2018)

### Improvements

- do not close window after pressing Esc
- remove delay when searching (suggested by @alon91)

## 5.2.0 (22/7/2018)

### Improvements

- significantly improve startup speed by injecting background page that does nothing

## 5.1.2 (26/9/2017)

### Bug Fixes

- Cannot drag item into empty folder

### Others

- Update bitcoin donation url

## 5.1.1 (6/4/2017)

### Bug Fixes

- Bookmark icon shrinks if title is too long

## 5.1.0 (6/4/2017)

### Changes

- Use `Alt + Shift + B` as keyboard shortcut (reported by n8wood in [#63](https://github.com/foray1010/Popup-my-Bookmarks/issues/63#issuecomment-291903966))

### Improvements

- Greatly improve performance when you have a very large set of bookmarks in the same folder

## 5.0.5 (30/3/2017)

### Bug Fixes

- Should not allow to trigger contextmenu by CTRL key on Windows
- Should not trigger contextmenu multiple time by long press

## 5.0.4 (29/3/2017)

### Bug Fixes

- Cannot use Norwegian Bokmål locale (again)

## 5.0.3 (29/3/2017)

### Bug Fixes

- Cannot use Norwegian Bokmål locale

## 5.0.2 (27/3/2017)

### Changes

- Use `Ctrl / CMD + Shift + B` as keyboard shortcut (reported by kaitan32 in [#63](https://github.com/foray1010/Popup-my-Bookmarks/issues/63))

## 5.0.1 (25/3/2017)

### Bug Fixes

- Wrong image/font path in css

## 5.0.0 (25/3/2017)

### Features

- Open popup by Ctrl / CMD + B (suggested by Sebastian B)
- Use `Tab` and `Shift + Tab` to navigate bookmarks
- Support trigger context menu by `Menu Key`

### Changes

- Increase minimum Chrome version from 26 to 34
- New option page (following options V2 standard)
- Support all kind of separators in separatethis.com
- Remove option: `Bookmarklet supported`, now we always support bookmarklet without permission `Read and change all your data on the websites you visit`

### Bug Fixes

- Cannot `Copy` a folder
- Cannot display the whole popup in OSX
- Wrong menu/editor position in some situations
- Setting of `Hide root folder` will be lost on second save
- `Remember last position` may fail if `Default expanded folder` is changed
- `Remember last position` may fail if any last used folder is removed

### Translations

- Support Norwegian Bokmål locales (thanks Bjorn Tore Asheim)
- Locales update: French(Alexis Schapman)

## 4.0.2.812 (8/12/2016)

### Bug Fixes

- Middle click is not working on Chrome 55

## 4.0.1.706 (7/6/2015)

### Improvements

- Dragging is now much more sensitive

### Bug Fixes

- Drag fail easily on Windows

## 4.0.0.706 (7/6/2015)

### Features

- Keyboard Navigation

### Changes

- Increase minimum Chrome version from 20 to 26
- More compact layout
- 'Open all bookmarks' now ignore separators
- Close folder by clicking its folder item when using Left Click mode (suggested by Bram Jacob)
- Close folder by clicking its box shadow when using Left Click mode

### Improvements

- More precise drag indicator
- Scroll the created item into view
- Resize the height of interface when displaying drag indicator

### Bug Fixes

- Drag indicator may still appear after dragging is ended
- Drag indicator appears next to the dragged item in some special cases
- Tooltip displays after separator has been edited
- Weird display of separator when using Chrome(Linux)
- Wrong editor position in some special cases

## 3.1.4.2802 (28/2/2015)

### Bug Fixes

- Cannot restore last position in some special cases (reported by KyosukeAce)

## 3.1.3.2702 (27/2/2015)

### Improvements

- Scroll back to the top when searching

## 3.1.2.2602 (26/2/2015)

### Bug Fixes

- Cannot save correct last position when dragging scrollbar (reported by KyosukeAce)

## 3.1.1.2602 (26/2/2015)

### Bug Fixes

- Fix logic error in moving bookmarks when option 'Open folders by Left Click' is activated
- Fix menu item cannot toggle visibility correctly

## 3.1.0.2302 (23/2/2015)

### Options

- Font family (suggested by Leebeaut Paul and David Bryant)
- Hide root folder (suggested by David Bryant)
- Remove 'Hide folder "Mobile bookmarks" if exists'

### Changes

- The options of 'Default expanded folder' are now depended on the root folders you have
- Highlight the default folder name when creating a new folder (Inspired by Dennis Long)

### Bug Fixes

- Fix wrong index when setting option 'Default expanded folder' in Opera

### Improvements

- Dragging is now much easier (a problem since the previous version)
- Reduce the sensitivity of closing folder when hovering its shadow

### Translations

- Support Russian locales (thanks Другие закладки)
- Locales update: Korean(Jinhyeok Lee)

## 3.0.0.506 (5/6/2014)

### Features

- Add Breadcrumb to tooltips during search (inspired by Ashish Bogawat)

### Options

- Remember last position (suggested by Роман Дрэйк, Ke Han)

### Changes

- Middle clicking folder or clicking "Open in background tab" will close the popup (suggested by John Cawthorne)
- Use native Chrome context menu when right clicking "input" element

### Bug Fixes

- Folders are displayed on search results
- Some search results assigned with incorrect menu
- Cannot expand folder sometimes when dragging (reported by David Bryant)

### Improvements

- Wider scrollbar (suggested by Fischers Fritze)
- Selection sort algorithm for "Sort by name", less chances to reach the maximum number of bookmarks operations per hour
- Optimized algorithm for dragging, much smoother

### Translations

- Support Dutch locales (thanks Marzas)
- Locales update: French(foX aCe), Italian(Giacomo Fabio Leone)

### Others

- A fresh new UI

## 2.2.0.1111 (11/11/2013)

### Changes

- Header's font is changed to 'Archivo Narrow' and is integrated to PmB (Size: 50KB)

### Bug Fixes

- Can't scroll while using user-defined font (reported by David Bryant)

## 2.1.0.2910 (29/10/2013)

### Features

- "Close" button for closing folder (inspired by Tom Sengers)

### Improvements

- Hovering bookmark won't close folder in "Open folders by Left Click" mode

## 2.0.1.1710 (17/10/2013)

### Bug Fixes

- Unselected bookmark is highlighted when dragging at specific condition

### Improvements

- More accurate search result
- Avoid showing separtors in search result

### Translations

- Locales update: Korean(Jinhyeok Lee)

## 2.0.0.2209 (22/9/2013)

### Features

- (Menu) Sort by name (suggested by Steven Pribilinskiy)

### Changes

- Shortened title of separator (inspired by Steven Pribilinskiy)
- Search results are now in Alphabetical order

### Options

- Search queries allowed

### Bug Fixes

- Deadloop bug when copying a folder to itself
- Item may be removed sometimes when dragging

### Improvements

- Speed up searching

### Translations

- Locales update: French(foX aCe), Italian(Giacomo Fabio Leone)

## 1.9.1.1808 (18/8/2013)

### Translations

- Support German locales (thanks Gurkan ZENGIN)
- Locales update: French(foX aCe), Italian(Giacomo Fabio Leone), Korean(Jinhyeok Lee), Vietnamese(Phan Anh)

## 1.9.0.1508 (15/8/2013)

### Features

- Support bookmarklet (reported by Chris Hagen)

### Changes

- Create new folder only when confirmed (suggested by David Bryant)

### Bug Fixes

- Can't show the last item in a folder with scrollbar displayed (reported by David Bryant)

### Translations

- Support Korean locales (thanks Jinhyeok Lee)

## 1.8.4.1008 (10/8/2013)

### Bug Fixes

- Can't scroll while dragging (reported by David Bryant)

### Translations

- Support Italian locales (thanks Giacomo Fabio Leone)

## 1.8.3.608 (6/8/2013)

### Bug Fixes

- Can't paste a folder with its subfolder content (reported by David Bryant)
- "No bookmark" indicator doesn't show in the root

### Translations

- Locales update: French(foX aCe), Vietnamese(Phan Anh)

## 1.8.2.2907 (29/7/2013)

### Improvements

- The style of separator
- Favicons can be enlarged with font size
- Popup bookmark editor after adding folder

## 1.8.1.2807 (28/7/2013)

### Changes

- Rearrange the order in menu

### Translations

- Support Vietnamese locales (thanks Phan Anh)

## 1.8.0.2607 (26/7/2013)

### Features

- Add separators

### Options

- Font size

### Bug Fixes

- Can't add folder in empty folder (reported by David Bryant)

## 1.7.2.2407 (24/7/2013)

### Features

- Color indicator for "Cut, Copy & Paste"

### Changes

- New bookmarks and folders are now inserted under the item you right clicked

### Bug Fixes

- Can't paste in empty folder

## 1.7.1.1707 (17/7/2013)

### Translations

- Locales update: French(foX aCe)

## 1.7.0.1007 (10/7/2013)

### Features

- Cut, Copy & Paste on the context menu (suggested by David Bryant)

### Changes

- The height and width of PmB are now auto stretched when needed

### Bug Fixes

- Context menu isn't showed completely in some specific situations

## 1.6.5.307 (3/7/2013)

### Improvements

- Algorithm of closing the cover between folders

## 1.6.4.207 (2/7/2013)

### Improvements

- Reduce the chance of closing the cover between folders mistakenly (inspired by David Bryant)
- The cover between folders can be closed by left click

### Bug Fixes

- Can't rename folder in "Open folders by Left Click" mode (reported by David Bryant)

## 1.6.3.3006 (30/6/2013)

### Bug Fixes

- Can't move bookmarks to main folder (reported by David Bryant)

## 1.6.2.2906 (29/6/2013)

### Options

- Open folders by Left Click

### Bug Fixes

- Can't move bookmarks to the first place of folders (reported by David Bryant)

## 1.6.1.2306 (23/6/2013)

### Bug Fixes

- When dragging bookmark on the original position, drag indicator may be displayed

### Improvements

- Reduce the sensitivity of hovering folders (suggested by David Bryant)
- Reduce RAM usage

### Translations

- Support French locales (thanks foX aCe)

## 1.6.0.206 (2/6/2013)

### Changes

- Folder name's font changed to "Arial Narrow"

### Options

- Left/ Ctrl+Left/ Shift+Left/ Middle Click to open bookmarks in specified location (inspired by Ahmad Moawya)
- Remove "Always open bookmark in new tab"

### Improvements

- Better color scheme and layout (hopefully)

## 1.5.1.1505 (15/5/2013)

### Bug Fixes

- The height of bookmark tree may be incorrect after searching

## 1.5.0.1305 (13/5/2013)

### Features

- Ctrl + Click to open bookmarks w/o closing the popup (suggested by Cantate Domino)

### Options

- Always open bookmark in new tab (suggested by bryan wang)

### Improvements

- Expand folders smoothly
- Smoother searching
- Scrolling distance now also depends on mouse wheel speed
- New options won't reset saved settings anymore

## 1.4.1.2904 (29/4/2013)

### Changes

- Folder name's font changed to "Agency FB" (inspired by Timo Oster)

## 1.4.0.2604 (26/4/2013)

### Features

- Middle click mouse to open all bookmarks (suggested by George Dekavalas)

### Changes

- Scrolling distance now depends on the height of a item (suggested by DiegoPerotti)

### Options

- Warn me when opening multiple tabs might slow down Chrome (suggested by George Dekavalas)

## 1.3.0.1404 (14/4/2013)

### Changes

- When a bookmark's title is null, show its url instead of title (suggested by DiegoPerotti)

### Bug Fixes

- Rename or delete bookmarks on search page may not be shown
- The height is not set correctly in some cases
- (Temporary) Duplicated scroll bar on Mac OS (reported by NightRain)

### Improvements

- Dragging improvement
- UI improvement: Right Click Menu

## 1.2.0.904 (9/4/2013)

### Bug Fixes

- Index is not correct when dragging an item downward in the same folder

## 1.1.1.404 (4/4/2013)

### Improvements

- UI improvement

## 1.1.0.3103 (31/3/2013)

### Features

- Scrolling Animation

### Bug Fixes

- Unable to drag item into an empty folder

### Improvements

- More responsive dragging

## 1.0.3.2903 (29/3/2013)

### Improvements

- Dragging improvement

### Translations

- Locales update: Simplified Chinese

## 1.0.2.2803 (28/3/2013)

### Bug Fixes

- Right click menu error(again)
- Url can't be shown when editing bookmarks
- Invalid input is not checked on Options page

### Improvements

- Reduce startup time

### Translations

- Support Traditional and Simplified Chinese locales

## 1.0.1.2703 (27/3/2013)

### Bug Fixes

- Right click menu error

### Improvements

- Dragging improvement
- UI improvement

## 1.0.0.2603 (26/3/2013)

- initial version
