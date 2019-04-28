import {SagaIterator} from 'redux-saga'
import {takeEvery, takeLatest} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import * as bookmarkCreators from '../actions'
import {addCurrentPage} from './modules/addCurrentPage'
import {addSeparator} from './modules/addSeparator'
import {createBookmark} from './modules/createBookmark'
import {createBookmarkAfterId} from './modules/createBookmarkAfterId'
import {deleteBookmark} from './modules/deleteBookmark'
import {editBookmark} from './modules/editBookmark'
import {getSearchResult} from './modules/getSearchResult'
import {initBookmarkTrees} from './modules/initBookmarkTrees'
import {moveBookmarkToDragIndicator} from './modules/moveBookmarkToDragIndicator'
import {openBookmarksInBrowser} from './modules/openBookmarksInBrowser'
import {openBookmarkTree} from './modules/openBookmarkTree'
import {openFolderInBrowser} from './modules/openFolderInBrowser'
import {pasteBookmark} from './modules/pasteBookmark'
import {refreshBookmarkTrees} from './modules/refreshBookmarkTrees'
import {sortBookmarksByName} from './modules/sortBookmarksByName'

export function* bookmarkSaga(): SagaIterator {
  yield takeLatest(getType(bookmarkCreators.addCurrentPage), addCurrentPage)
  yield takeLatest(getType(bookmarkCreators.addSeparator), addSeparator)
  yield takeEvery(getType(bookmarkCreators.createBookmark), createBookmark)
  yield takeLatest(getType(bookmarkCreators.createBookmarkAfterId), createBookmarkAfterId)
  yield takeEvery(getType(bookmarkCreators.deleteBookmark), deleteBookmark)
  yield takeLatest(getType(bookmarkCreators.editBookmark), editBookmark)
  yield takeLatest(getType(bookmarkCreators.getSearchResult), getSearchResult)
  yield takeLatest(getType(bookmarkCreators.initBookmarkTrees), initBookmarkTrees)
  yield takeLatest(
    getType(bookmarkCreators.moveBookmarkToDragIndicator),
    moveBookmarkToDragIndicator
  )
  yield takeLatest(getType(bookmarkCreators.openBookmarkTree), openBookmarkTree)
  yield takeLatest(getType(bookmarkCreators.openBookmarksInBrowser), openBookmarksInBrowser)
  yield takeLatest(getType(bookmarkCreators.openFolderInBrowser), openFolderInBrowser)
  yield takeLatest(getType(bookmarkCreators.pasteBookmark), pasteBookmark)
  yield takeLatest(getType(bookmarkCreators.refreshBookmarkTrees), refreshBookmarkTrees)
  yield takeLatest(getType(bookmarkCreators.sortBookmarksByName), sortBookmarksByName)
}
