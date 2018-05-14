// @flow strict

import webExtension from 'webextension-polyfill'

// workaround as following functions cannot pass redux-saga
// and throw error: `TypeError: Function.prototype.toString requires that 'this' be a Function`
export const clearStorage = (...args: $ReadOnlyArray<any>) =>
  webExtension.storage.sync.clear(...args)
export const createBookmark = (...args: $ReadOnlyArray<any>) =>
  webExtension.bookmarks.create(...args)
export const createTab = (...args: $ReadOnlyArray<any>) => webExtension.tabs.create(...args)
export const createWindow = (...args: $ReadOnlyArray<any>) => webExtension.windows.create(...args)
export const getBookmarkChildNodes = (...args: $ReadOnlyArray<any>) =>
  webExtension.bookmarks.getChildren(...args)
export const getBookmarkNodes = (...args: $ReadOnlyArray<any>) =>
  webExtension.bookmarks.get(...args)
export const getI18n = (...args: $ReadOnlyArray<any>) => webExtension.i18n.getMessage(...args)
export const getStorage = (...args: $ReadOnlyArray<any>) => webExtension.storage.sync.get(...args)
export const moveBookmark = (...args: $ReadOnlyArray<any>) => webExtension.bookmarks.move(...args)
export const queryTabs = (...args: $ReadOnlyArray<any>) => webExtension.tabs.query(...args)
export const removeBookmark = (...args: $ReadOnlyArray<any>) =>
  webExtension.bookmarks.remove(...args)
export const removeBookmarkTree = (...args: $ReadOnlyArray<any>) =>
  webExtension.bookmarks.removeTree(...args)
export const searchBookmarkNodes = (...args: $ReadOnlyArray<any>) =>
  webExtension.bookmarks.search(...args)
export const setStorage = (...args: $ReadOnlyArray<any>) => webExtension.storage.sync.set(...args)
export const updateBookmark = (...args: $ReadOnlyArray<any>) =>
  webExtension.bookmarks.update(...args)
export const updateTab = (...args: $ReadOnlyArray<any>) => webExtension.tabs.update(...args)
