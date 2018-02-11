import * as R from 'ramda'
import {all, call} from 'redux-saga/effects'
import webExtension from 'webextension-polyfill'

import {ROOT_ID} from '../../../../constants'
import {toBookmark} from './converters'

const getBookmarkChildNodes = (...args) => webExtension.bookmarks.getChildren(...args)
const getBookmarkNodes = (...args) => webExtension.bookmarks.get(...args)
const searchBookmarkNodes = (...args) => webExtension.bookmarks.search(...args)

export function* getBookmark(id) {
  const bookmarkNodes = yield call(getBookmarkNodes, id)
  return toBookmark(bookmarkNodes[0])
}

export function* getBookmarkChildren(id) {
  const bookmarkChildNodes = yield call(getBookmarkChildNodes, id)
  return R.map(toBookmark, bookmarkChildNodes)
}

export function* getBookmarkTree(id) {
  const [bookmark, bookmarkChildren] = yield all([
    call(getBookmark, id),
    call(getBookmarkChildren, id)
  ])
  return {
    children: bookmarkChildren,
    parent: bookmark
  }
}

export function* getBookmarkTrees(restTreeIds, options) {
  const [firstTree, ...restTrees] = yield all([
    call(getFirstBookmarkTree, options),
    ...R.map((id) => call(tryGetBookmarkTree, id), restTreeIds)
  ])
  return R.reduce(
    (acc, tree) => {
      // if `tree` is deleted or not belong to this parent anymore,
      // ignore all its children
      const isReduced = !tree && R.last(acc).id === tree.parentId
      if (isReduced) return R.reduced(acc)

      return [...acc, tree]
    },
    [firstTree],
    restTrees
  )
}

export function* getFirstBookmarkTree(options) {
  const [firstTreeInfo, rootFolders] = yield all([
    call(getBookmarkTree, String(options.defExpand)),
    call(getBookmarkChildren, ROOT_ID)
  ])
  return {
    ...firstTreeInfo,
    children: [
      ...R.reject((bookmarkInfo) => {
        const idNumber = Number(bookmarkInfo.id)
        return idNumber === options.defExpand || options.hideRootFolder.includes(idNumber)
      }, rootFolders),
      ...firstTreeInfo.children
    ]
  }
}

export function* searchBookmarks(searchQuery) {
  const searchResultNodes = yield call(searchBookmarkNodes, searchQuery)
  return R.map(toBookmark, searchResultNodes)
}

export function* tryGetBookmarkTree(id) {
  try {
    return yield call(getBookmarkTree, id)
  } catch (err) {
    console.warn(err)
    return null
  }
}
