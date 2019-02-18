// @flow strict

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {all, call} from 'redux-saga/effects'

import type {Options} from '../../../../../common/types/options'
import {
  getBookmarkChildNodes,
  getBookmarkNodes,
  getI18n,
  searchBookmarkNodes
} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import type {BookmarkInfo, BookmarkTree} from '../../../../types'
import {simulateBookmark, toBookmarkInfo} from '../../utils/converters'

export function* getBookmarkInfo(id: string): Saga<BookmarkInfo> {
  if (id.startsWith(CST.NO_BOOKMARK_ID_PREFIX)) {
    return simulateBookmark({
      id,
      parentId: id.replace(CST.NO_BOOKMARK_ID_PREFIX, ''),
      title: yield call(getI18n, 'noBkmark'),
      type: CST.TYPE_NO_BOOKMARK
    })
  }

  const bookmarkNodes = yield call(getBookmarkNodes, id)
  return toBookmarkInfo(bookmarkNodes[0])
}

export function* getBookmarkChildren(id: string): Saga<Array<BookmarkInfo>> {
  const bookmarkChildNodes = yield call(getBookmarkChildNodes, id)
  return R.map(toBookmarkInfo, bookmarkChildNodes)
}

export function* getBookmarkTree(id: string): Saga<BookmarkTree> {
  const [bookmarkInfo, bookmarkChildren] = yield all([
    call(getBookmarkInfo, id),
    call(getBookmarkChildren, id)
  ])
  return {
    children: bookmarkChildren.length ?
      bookmarkChildren :
      [yield call(getBookmarkInfo, CST.NO_BOOKMARK_ID_PREFIX + id)],
    parent: bookmarkInfo
  }
}

export function* getBookmarkTrees(
  restTreeIds: Array<string>,
  options: Options
): Saga<Array<BookmarkTree>> {
  const [firstTree, ...restTrees]: Array<BookmarkTree> = yield all([
    call(getFirstBookmarkTree, options),
    ...restTreeIds.map((id) => call(tryGetBookmarkTree, id))
  ])

  let acc = [firstTree]
  for (const tree of restTrees) {
    // if `tree` is deleted or not belong to this parent anymore,
    // ignore all its children
    const isBreak =
      tree === null ||
      // in case it is root folder that open from root
      (!tree.parent.isRoot && acc[acc.length - 1].parent.id !== tree.parent.parentId)
    if (isBreak) break

    acc = [...acc, tree]
  }
  return acc
}

export function* getFirstBookmarkTree(options: Options): Saga<BookmarkTree> {
  const [firstTreeInfo, rootFolders] = yield all([
    call(getBookmarkTree, String(options.defExpand)),
    call(getBookmarkChildren, CST.ROOT_ID)
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

type SearchQuery = {| query: string |}
export function* searchBookmarks(searchQuery: SearchQuery): Saga<Array<BookmarkInfo>> {
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
