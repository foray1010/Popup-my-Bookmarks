import type { SagaIterator } from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import type webExtension from 'webextension-polyfill'

import type { Options } from '../../../../../core/types/options'
import {
  getBookmarkChildNodes,
  getBookmarkNodes,
  getI18n,
  searchBookmarkNodes,
} from '../../../../../core/utils'
import * as CST from '../../../../constants'
import type { BookmarkInfo, BookmarkTree } from '../../../../types'
import { simulateBookmark, toBookmarkInfo } from '../../utils/converters'

export function* getBookmarkInfo(id: string): SagaIterator<BookmarkInfo> {
  if (id.startsWith(CST.NO_BOOKMARK_ID_PREFIX)) {
    const title: string = yield call(getI18n, 'noBkmark')
    return simulateBookmark({
      id,
      parentId: id.replace(CST.NO_BOOKMARK_ID_PREFIX, ''),
      title,
      type: CST.BOOKMARK_TYPES.NO_BOOKMARK,
    })
  }

  const bookmarkNodes: Array<webExtension.bookmarks.BookmarkTreeNode> = yield call(
    getBookmarkNodes,
    id,
  )
  return toBookmarkInfo(bookmarkNodes[0])
}

export function* getBookmarkChildren(
  id: string,
): SagaIterator<Array<BookmarkInfo>> {
  const bookmarkChildNodes: Array<webExtension.bookmarks.BookmarkTreeNode> = yield call(
    getBookmarkChildNodes,
    id,
  )
  return bookmarkChildNodes.map(toBookmarkInfo)
}

export function* getBookmarkTree(id: string): SagaIterator<BookmarkTree> {
  const [bookmarkInfo, bookmarkChildren]: [
    BookmarkInfo,
    Array<BookmarkInfo>,
  ] = yield all([call(getBookmarkInfo, id), call(getBookmarkChildren, id)])
  return {
    children: bookmarkChildren.length
      ? bookmarkChildren
      : ([
          yield call(getBookmarkInfo, CST.NO_BOOKMARK_ID_PREFIX + id),
        ] as Array<BookmarkInfo>),
    parent: bookmarkInfo,
  }
}

export function* getBookmarkTrees(
  restTreeIds: Array<string>,
  options: Partial<Options>,
): SagaIterator<Array<BookmarkTree>> {
  const [firstTree, ...restTrees]: Array<BookmarkTree> = yield all([
    call(getFirstBookmarkTree, options),
    ...restTreeIds.map((id) => call(tryGetBookmarkTree, id)),
  ])

  let acc = [firstTree]
  for (const tree of restTrees) {
    // if `tree` is deleted or not belong to this parent anymore,
    // ignore all its children
    const isBreak =
      tree === null ||
      // in case it is root folder that open from root
      (!tree.parent.isRoot &&
        acc[acc.length - 1].parent.id !== tree.parent.parentId)
    if (isBreak) break

    acc = [...acc, tree]
  }
  return acc
}

export function* getFirstBookmarkTree(
  options: Partial<Options>,
): SagaIterator<BookmarkTree> {
  const [firstTreeInfo, rootFolders]: [
    BookmarkTree,
    Array<BookmarkInfo>,
  ] = yield all([
    call(getBookmarkTree, String(options[CST.OPTIONS.DEF_EXPAND])),
    call(getBookmarkChildren, CST.ROOT_ID),
  ])
  return {
    ...firstTreeInfo,
    children: [
      ...rootFolders.filter((bookmarkInfo) => {
        const idNumber = Number(bookmarkInfo.id)
        return !(
          idNumber === options[CST.OPTIONS.DEF_EXPAND] ||
          (options[CST.OPTIONS.HIDE_ROOT_FOLDER] ?? []).includes(idNumber)
        )
      }),
      ...firstTreeInfo.children,
    ],
  }
}

interface SearchQuery {
  query: string
}
export function* searchBookmarks(
  searchQuery: SearchQuery,
): SagaIterator<Array<BookmarkInfo>> {
  const searchResultNodes: Array<webExtension.bookmarks.BookmarkTreeNode> = yield call(
    searchBookmarkNodes,
    searchQuery,
  )
  return searchResultNodes.map(toBookmarkInfo)
}

export function* tryGetBookmarkTree(
  id: string,
): SagaIterator<BookmarkTree | null> {
  try {
    return yield call(getBookmarkTree, id)
  } catch (err) {
    return null
  }
}
