import { takeLatest } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import * as bookmarkCreators from '../actions'
import { getSearchResult } from './modules/getSearchResult'
import { initBookmarkTrees } from './modules/initBookmarkTrees'
import { moveBookmarkToDragIndicator } from './modules/moveBookmarkToDragIndicator'
import { openBookmarkTree } from './modules/openBookmarkTree'
import { pasteBookmark } from './modules/pasteBookmark'
import { refreshBookmarkTrees } from './modules/refreshBookmarkTrees'
import { sortBookmarksByName } from './modules/sortBookmarksByName'
import { toggleBookmarkTree } from './modules/toggleBookmarkTree'

export function* bookmarkSaga() {
  yield takeLatest(getType(bookmarkCreators.getSearchResult), getSearchResult)
  yield takeLatest(
    getType(bookmarkCreators.initBookmarkTrees),
    initBookmarkTrees,
  )
  yield takeLatest(
    getType(bookmarkCreators.moveBookmarkToDragIndicator),
    moveBookmarkToDragIndicator,
  )
  yield takeLatest(getType(bookmarkCreators.openBookmarkTree), openBookmarkTree)
  yield takeLatest(getType(bookmarkCreators.pasteBookmark), pasteBookmark)
  yield takeLatest(
    getType(bookmarkCreators.refreshBookmarkTrees),
    refreshBookmarkTrees,
  )
  yield takeLatest(
    getType(bookmarkCreators.sortBookmarksByName),
    sortBookmarksByName,
  )
  yield takeLatest(
    getType(bookmarkCreators.toggleBookmarkTree),
    toggleBookmarkTree,
  )
}
