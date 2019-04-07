import {SagaIterator} from 'redux-saga'
import {all, takeEvery, takeLatest} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import {silenceSaga} from '../../../../common/utils'
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
import {pasteBookmark} from './modules/pasteBookmark'
import {refreshBookmarkTrees} from './modules/refreshBookmarkTrees'
import {sortBookmarksByName} from './modules/sortBookmarksByName'

export function* bookmarkSaga(): SagaIterator {
  yield all([
    takeLatest(getType(bookmarkCreators.addCurrentPage), silenceSaga(addCurrentPage)),
    takeLatest(getType(bookmarkCreators.addSeparator), silenceSaga(addSeparator)),
    takeEvery(getType(bookmarkCreators.createBookmark), silenceSaga(createBookmark)),
    takeLatest(getType(bookmarkCreators.createBookmarkAfterId), silenceSaga(createBookmarkAfterId)),
    takeEvery(getType(bookmarkCreators.deleteBookmark), silenceSaga(deleteBookmark)),
    takeLatest(getType(bookmarkCreators.editBookmark), silenceSaga(editBookmark)),
    takeLatest(getType(bookmarkCreators.getSearchResult), silenceSaga(getSearchResult)),
    takeLatest(getType(bookmarkCreators.initBookmarkTrees), silenceSaga(initBookmarkTrees)),
    takeLatest(
      getType(bookmarkCreators.moveBookmarkToDragIndicator),
      silenceSaga(moveBookmarkToDragIndicator)
    ),
    takeLatest(getType(bookmarkCreators.openBookmarkTree), silenceSaga(openBookmarkTree)),
    takeLatest(
      getType(bookmarkCreators.openBookmarksInBrowser),
      silenceSaga(openBookmarksInBrowser)
    ),
    takeLatest(getType(bookmarkCreators.pasteBookmark), silenceSaga(pasteBookmark)),
    takeLatest(getType(bookmarkCreators.refreshBookmarkTrees), silenceSaga(refreshBookmarkTrees)),
    takeLatest(getType(bookmarkCreators.sortBookmarksByName), silenceSaga(sortBookmarksByName))
  ])
}
