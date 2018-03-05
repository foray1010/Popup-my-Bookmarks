// @flow

import webExtension from 'webextension-polyfill'

// workaround as following functions cannot pass redux-saga
// and throw error: `TypeError: Function.prototype.toString requires that 'this' be a Function`
export const clearStorage = (...args: $ReadOnlyArray<*>) =>
  webExtension.storage.sync.clear(...args)
export const createBookmark = (...args: $ReadOnlyArray<*>) =>
  webExtension.bookmarks.create(...args)
export const createTab = (...args: $ReadOnlyArray<*>) => webExtension.tabs.create(...args)
export const createWindow = (...args: $ReadOnlyArray<*>) => webExtension.windows.create(...args)
export const getBookmarkChildNodes = (...args: $ReadOnlyArray<*>) =>
  webExtension.bookmarks.getChildren(...args)
export const getBookmarkNodes = (...args: $ReadOnlyArray<*>) => webExtension.bookmarks.get(...args)
export const getI18n = (...args: $ReadOnlyArray<*>) => webExtension.i18n.getMessage(...args)
export const getStorage = (...args: $ReadOnlyArray<*>) => webExtension.storage.sync.get(...args)
export const moveBookmark = (...args: $ReadOnlyArray<*>) => webExtension.bookmarks.move(...args)
export const queryTabs = (...args: $ReadOnlyArray<*>) => webExtension.tabs.query(...args)
export const removeBookmark = (...args: $ReadOnlyArray<*>) =>
  webExtension.bookmarks.remove(...args)
export const removeBookmarkTree = (...args: $ReadOnlyArray<*>) =>
  webExtension.bookmarks.removeTree(...args)
export const searchBookmarkNodes = (...args: $ReadOnlyArray<*>) =>
  webExtension.bookmarks.search(...args)
export const setStorage = (...args: $ReadOnlyArray<*>) => webExtension.storage.sync.set(...args)
