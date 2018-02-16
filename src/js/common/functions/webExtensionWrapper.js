import webExtension from 'webextension-polyfill'

// workaround as following functions cannot pass redux-saga
// and throw error: `TypeError: Function.prototype.toString requires that 'this' be a Function`
export const clearStorage = (...args) => webExtension.storage.sync.clear(...args)
export const getBookmarkChildNodes = (...args) => webExtension.bookmarks.getChildren(...args)
export const getBookmarkNodes = (...args) => webExtension.bookmarks.get(...args)
export const getStorage = (...args) => webExtension.storage.sync.get(...args)
export const searchBookmarkNodes = (...args) => webExtension.bookmarks.search(...args)
export const setStorage = (...args) => webExtension.storage.sync.set(...args)
