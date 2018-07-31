// @flow strict

import webExtension from 'webextension-polyfill'

// workaround as following functions cannot pass redux-saga
// and throw error: `TypeError: Function.prototype.toString requires that 'this' be a Function`
export const clearStorage = (...args: Array<any>) => webExtension.storage.sync.clear(...args)
export const createBookmark = (...args: Array<any>) => webExtension.bookmarks.create(...args)
export const createTab = (...args: Array<any>) => webExtension.tabs.create(...args)
export const createWindow = (...args: Array<any>) => webExtension.windows.create(...args)
export const getBookmarkChildNodes = (...args: Array<any>) =>
  webExtension.bookmarks.getChildren(...args)
export const getBookmarkNodes = (...args: Array<any>) => webExtension.bookmarks.get(...args)
export const getI18n = (...args: Array<any>) => webExtension.i18n.getMessage(...args)
export const getStorage = (...args: Array<any>) => webExtension.storage.sync.get(...args)
export const moveBookmark = (...args: Array<any>) => webExtension.bookmarks.move(...args)
export const queryTabs = (...args: Array<any>) => webExtension.tabs.query(...args)
export const removeBookmark = (...args: Array<any>) => webExtension.bookmarks.remove(...args)
export const removeBookmarkTree = (...args: Array<any>) =>
  webExtension.bookmarks.removeTree(...args)
export const searchBookmarkNodes = (...args: Array<any>) => webExtension.bookmarks.search(...args)
export const setStorage = (...args: Array<any>) => webExtension.storage.sync.set(...args)
export const updateBookmark = (...args: Array<any>) => webExtension.bookmarks.update(...args)
export const updateTab = (...args: Array<any>) => webExtension.tabs.update(...args)
