// @flow

import type {Saga} from 'redux-saga'
import {all, takeEvery, takeLatest} from 'redux-saga/effects'

import {silenceSaga} from '../../../../common/utils'
import {bookmarkTypes} from '../actions'
import {addCurrentPage} from './modules/addCurrentPage'
import {addSeparator} from './modules/addSeparator'
import {deleteBookmark} from './modules/deleteBookmark'
import {getSearchResult} from './modules/getSearchResult'
import {initBookmarkTrees} from './modules/initBookmarkTrees'
import {openBookmarksInBrowser} from './modules/openBookmarksInBrowser'
import {openBookmarkTree} from './modules/openBookmarkTree'
import {pasteBookmark} from './modules/pasteBookmark'
import {refreshBookmarkTrees} from './modules/refreshBookmarkTrees'
import {sortBookmarksByName} from './modules/sortBookmarksByName'

export function* bookmarkSaga(): Saga<void> {
  yield all([
    takeLatest(bookmarkTypes.ADD_CURRENT_PAGE, silenceSaga(addCurrentPage)),
    takeLatest(bookmarkTypes.ADD_SEPARATOR, silenceSaga(addSeparator)),
    takeEvery(bookmarkTypes.DELETE_BOOKMARK, silenceSaga(deleteBookmark)),
    takeLatest(bookmarkTypes.GET_SEARCH_RESULT, silenceSaga(getSearchResult)),
    takeLatest(bookmarkTypes.INIT_BOOKMARK_TREES, silenceSaga(initBookmarkTrees)),
    takeLatest(bookmarkTypes.OPEN_BOOKMARK_TREE, silenceSaga(openBookmarkTree)),
    takeLatest(bookmarkTypes.OPEN_BOOKMARKS_IN_BROWSER, silenceSaga(openBookmarksInBrowser)),
    takeLatest(bookmarkTypes.PASTE_BOOKMARK, silenceSaga(pasteBookmark)),
    takeLatest(bookmarkTypes.REFRESH_BOOKMARK_TREES, silenceSaga(refreshBookmarkTrees)),
    takeLatest(bookmarkTypes.SORT_BOOKMARKS_BY_NAME, silenceSaga(sortBookmarksByName))
  ])
}
