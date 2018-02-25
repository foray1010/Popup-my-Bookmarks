// @flow

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {all, call} from 'redux-saga/effects'

import {
  getBookmarkChildNodes,
  getBookmarkNodes,
  searchBookmarkNodes
} from '../../../../../common/functions'
import {ROOT_ID} from '../../../../constants'
import type {BookmarkInfo, BookmarkTree} from '../../../../types'
import {toBookmarkInfo} from './converters'

export function* getBookmarkInfo(id: string): Saga<BookmarkInfo> {
  const bookmarkNodes = yield call(getBookmarkNodes, id)
  return toBookmarkInfo(bookmarkNodes[0])
}

export function* getBookmarkChildren(id: string): Saga<$ReadOnlyArray<BookmarkInfo>> {
  const bookmarkChildNodes = yield call(getBookmarkChildNodes, id)
  return R.map(toBookmarkInfo, bookmarkChildNodes)
}

export function* getBookmarkTree(id: string): Saga<BookmarkTree> {
  const [bookmarkInfo, bookmarkChildren] = yield all([
    call(getBookmarkInfo, id),
    call(getBookmarkChildren, id)
  ])
  return {
    children: bookmarkChildren,
    parent: bookmarkInfo
  }
}

export function* getBookmarkTrees(
  restTreeIds: $ReadOnlyArray<string>,
  options: Object
): Saga<$ReadOnlyArray<BookmarkTree>> {
  const [firstTree, ...restTrees]: $ReadOnlyArray<BookmarkTree> = yield all([
    call(getFirstBookmarkTree, options),
    ...restTreeIds.map((id) => call(tryGetBookmarkTree, id))
  ])
  return R.reduce(
    (acc, tree) => {
      // if `tree` is deleted or not belong to this parent anymore,
      // ignore all its children
      const isReduced = tree === null || R.last(acc).parent.id !== tree.parent.parentId
      if (isReduced) return R.reduced(acc)

      return [...acc, tree]
    },
    [firstTree],
    restTrees
  )
}

export function* getFirstBookmarkTree(options: Object): Saga<BookmarkTree> {
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

export function* searchBookmarks(searchQuery: string): Saga<$ReadOnlyArray<BookmarkInfo>> {
  const searchResultNodes = yield call(searchBookmarkNodes, searchQuery)
  return R.map(toBookmarkInfo, searchResultNodes)
}

export function* tryGetBookmarkTree(id: string): Saga<?BookmarkTree> {
  try {
    return yield call(getBookmarkTree, id)
  } catch (err) {
    return null
  }
}
