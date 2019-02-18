// @flow strict

import * as R from 'ramda'
import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {call} from 'redux-saga/effects'

import {moveBookmark} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import {sortByTitle} from '../../../../utils'
import {bookmarkCreators} from '../../actions'
import {getBookmarkInfo, getBookmarkTree} from '../utils/getters'

const splitSectionsBySeparator = R.groupWith(
  R.compose(
    R.not,
    R.propEq('type', CST.TYPE_SEPARATOR),
    R.nthArg(1)
  )
)

const groupByType = R.groupBy(R.prop('type'))
const ungroupWithPriority = (groups) => {
  const sortedTypes = R.uniq([
    CST.TYPE_SEPARATOR,
    CST.TYPE_FOLDER,
    CST.TYPE_BOOKMARK,
    ...Object.keys(groups)
  ])
  return sortedTypes.reduce((acc, type) => [...acc, ...R.propOr([], type, groups)], [])
}

const sortBookmarks = R.compose(
  R.flatten,
  R.map(ungroupWithPriority),
  R.map(R.map(sortByTitle)),
  R.map(groupByType),
  splitSectionsBySeparator
)

export function* sortBookmarksByName({
  payload
}: ActionType<typeof bookmarkCreators.sortBookmarksByName>): Saga<void> {
  const bookmarkTree = yield call(getBookmarkTree, payload.parentId)

  const sortedBookmarkInfos = sortBookmarks(bookmarkTree.children)

  // Moving bookmarks to sorted index
  for (const [index, bookmarkInfo] of sortedBookmarkInfos.entries()) {
    // $FlowFixMe
    const currentBookmarkInfo = yield call(getBookmarkInfo, bookmarkInfo.id)
    const currentIndex = currentBookmarkInfo.storageIndex
    if (currentIndex !== index) {
      // $FlowFixMe
      yield call(moveBookmark, bookmarkInfo.id, {
        // if new index is after current index, need to add 1,
        // because index means the position in current array,
        // which also count the current position
        index: index + (index > currentIndex ? 1 : 0)
      })
    }
  }
}
