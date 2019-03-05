import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {all, call} from 'redux-saga/effects'

import {Options} from '../../../../../common/types/options'
import {
  getBookmarkChildNodes,
  getBookmarkNodes,
  getI18n,
  searchBookmarkNodes
} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import {BookmarkInfo, BookmarkTree} from '../../../../types'
import {simulateBookmark, toBookmarkInfo} from '../../utils/converters'

export function* getBookmarkInfo(id: string): SagaIterator {
  if (id.startsWith(CST.NO_BOOKMARK_ID_PREFIX)) {
    return simulateBookmark({
      id,
      parentId: id.replace(CST.NO_BOOKMARK_ID_PREFIX, ''),
      title: yield call(getI18n, 'noBkmark'),
      type: CST.BOOKMARK_TYPES.NO_BOOKMARK
    })
  }

  const bookmarkNodes = yield call(getBookmarkNodes, id)
  return toBookmarkInfo(bookmarkNodes[0])
}

export function* getBookmarkChildren(id: string): SagaIterator {
  const bookmarkChildNodes = yield call(getBookmarkChildNodes, id)
  return R.map(toBookmarkInfo, bookmarkChildNodes)
}

export function* getBookmarkTree(id: string): SagaIterator {
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
  options: Partial<Options>
): SagaIterator {
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

export function* getFirstBookmarkTree(options: Partial<Options>): SagaIterator {
  const [firstTreeInfo, rootFolders]: [BookmarkTree, Array<BookmarkInfo>] = yield all([
    call(getBookmarkTree, String(options.defExpand)),
    call(getBookmarkChildren, CST.ROOT_ID)
  ])
  return {
    ...firstTreeInfo,
    children: [
      ...R.reject((bookmarkInfo) => {
        const idNumber = Number(bookmarkInfo.id)
        return idNumber === options.defExpand || (options.hideRootFolder || []).includes(idNumber)
      }, rootFolders),
      ...firstTreeInfo.children
    ]
  }
}

interface SearchQuery {
  query: string
}
export function* searchBookmarks(searchQuery: SearchQuery): SagaIterator {
  const searchResultNodes = yield call(searchBookmarkNodes, searchQuery)
  return R.map(toBookmarkInfo, searchResultNodes)
}

export function* tryGetBookmarkTree(id: string): SagaIterator {
  try {
    return yield call(getBookmarkTree, id)
  } catch (err) {
    return null
  }
}
