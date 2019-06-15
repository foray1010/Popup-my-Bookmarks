import webExtension from 'webextension-polyfill'

// workaround as following functions cannot pass redux-saga
// and throw error: `TypeError: Function.prototype.toString requires that 'this' be a Function`
const wrap = <T, U extends Array<T>, V>(fn: (...args: U) => V) => {
  return (...args: U): V => fn(...args)
}

export const clearStorage = wrap(webExtension.storage.sync.clear)
export const createBookmark = wrap(webExtension.bookmarks.create)
export const createTab = wrap(webExtension.tabs.create)
export const createWindow = wrap(webExtension.windows.create)
export const executeScript = wrap(webExtension.tabs.executeScript)
export const getBookmarkChildNodes = wrap(webExtension.bookmarks.getChildren)
export const getBookmarkNodes = wrap(webExtension.bookmarks.get)
export const getI18n = wrap(webExtension.i18n.getMessage)
export const getLocalStorage = wrap(webExtension.storage.local.get)
export const getSyncStorage = wrap(webExtension.storage.sync.get)
export const moveBookmark = wrap(webExtension.bookmarks.move)
export const queryTabs = wrap(webExtension.tabs.query)
export const removeBookmark = wrap(webExtension.bookmarks.remove)
export const removeBookmarkTree = wrap(webExtension.bookmarks.removeTree)
export const searchBookmarkNodes = wrap(webExtension.bookmarks.search)
export const setLocalStorage = wrap(webExtension.storage.local.set)
export const setSyncStorage = wrap(webExtension.storage.sync.set)
export const updateBookmark = wrap(webExtension.bookmarks.update)
export const updateTab = wrap(webExtension.tabs.update)
