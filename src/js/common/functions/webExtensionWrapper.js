// @flow

import webExtension from 'webextension-polyfill'

// workaround as following functions cannot pass redux-saga
// and throw error: `TypeError: Function.prototype.toString requires that 'this' be a Function`
export const clearStorage = (...args: $ReadOnlyArray<*>) =>
  webExtension.storage.sync.clear(...args)
export const getBookmarkChildNodes = (...args: $ReadOnlyArray<*>) =>
  webExtension.bookmarks.getChildren(...args)
export const getBookmarkNodes = (...args: $ReadOnlyArray<*>) => webExtension.bookmarks.get(...args)
export const getStorage = (...args: $ReadOnlyArray<*>) => webExtension.storage.sync.get(...args)
export const searchBookmarkNodes = (...args: $ReadOnlyArray<*>) =>
  webExtension.bookmarks.search(...args)
export const setStorage = (...args: $ReadOnlyArray<*>) => webExtension.storage.sync.set(...args)
