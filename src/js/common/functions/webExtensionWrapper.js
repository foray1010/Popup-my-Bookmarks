// @flow

import webExtension from 'webextension-polyfill'

// workaround as following functions cannot pass redux-saga
// and throw error: `TypeError: Function.prototype.toString requires that 'this' be a Function`
export const clearStorage = (...args: Array<*>) => webExtension.storage.sync.clear(...args)
export const getBookmarkChildNodes = (...args: Array<*>) =>
  webExtension.bookmarks.getChildren(...args)
export const getBookmarkNodes = (...args: Array<*>) => webExtension.bookmarks.get(...args)
export const getStorage = (...args: Array<*>) => webExtension.storage.sync.get(...args)
export const searchBookmarkNodes = (...args: Array<*>) => webExtension.bookmarks.search(...args)
export const setStorage = (...args: Array<*>) => webExtension.storage.sync.set(...args)
