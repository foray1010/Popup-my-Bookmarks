import webExtension from 'webextension-polyfill'

// workaround as following functions cannot pass redux-saga
// and throw error: `TypeError: Function.prototype.toString requires that 'this' be a Function`
const wrap = <T extends Array<unknown>, U>(fn: (...args: T) => U) => {
  return (...args: T): U => fn(...args)
}

export const getBookmarkChildNodes = wrap(webExtension.bookmarks.getChildren)
export const getBookmarkNodes = wrap(webExtension.bookmarks.get)
export const getI18n = wrap(webExtension.i18n.getMessage)
export const getLocalStorage = wrap(webExtension.storage.local.get)
export const moveBookmark = wrap(webExtension.bookmarks.move)
export const searchBookmarkNodes = wrap(webExtension.bookmarks.search)
