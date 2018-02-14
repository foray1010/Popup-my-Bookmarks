import * as R from 'ramda'
import {all, call} from 'redux-saga/effects'
import webExtension from 'webextension-polyfill'

import {ROOT_ID} from '../../../../constants'
import {toBookmarkInfo} from './converters'

const getBookmarkChildNodes = (...args) => webExtension.bookmarks.getChildren(...args)
const getBookmarkNodes = (...args) => webExtension.bookmarks.get(...args)
const searchBookmarkNodes = (...args) => webExtension.bookmarks.search(...args)

export function* getBookmarkInfo(id) {
  const bookmarkNodes = yield call(getBookmarkNodes, id)
  return toBookmarkInfo(bookmarkNodes[0])
}

export function* getBookmarkChildren(id) {
  const bookmarkChildNodes = yield call(getBookmarkChildNodes, id)
  return R.map(toBookmarkInfo, bookmarkChildNodes)
}

export function* getBookmarkTree(id) {
  const [bookmarkInfo, bookmarkChildren] = yield all([
    call(getBookmarkInfo, id),
    call(getBookmarkChildren, id)
  ])
  return {
    children: bookmarkChildren,
    parent: bookmarkInfo
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
  return R.map(toBookmarkInfo, searchResultNodes)
}

export function* tryGetBookmarkTree(id) {
  try {
    return yield call(getBookmarkTree, id)
  } catch (err) {
    console.warn(err)
    return null
  }
}
