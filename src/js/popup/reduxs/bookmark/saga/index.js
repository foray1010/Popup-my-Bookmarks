// @flow

import type {Saga} from 'redux-saga'
import {all, takeEvery, takeLatest} from 'redux-saga/effects'

import {bookmarkTypes} from '../actions'
import {addCurrentPage} from './modules/addCurrentPage'
import {addSeparator} from './modules/addSeparator'
import {deleteBookmark} from './modules/deleteBookmark'
import {getSearchResult} from './modules/getSearchResult'
import {initBookmarkTrees} from './modules/initBookmarkTrees'
import {openBookmarks} from './modules/openBookmarks'
import {openBookmarkTree} from './modules/openBookmarkTree'
import {refreshBookmarkTrees} from './modules/refreshBookmarkTrees'

export function* bookmarkSaga(): Saga<void> {
  yield all([
    takeLatest(bookmarkTypes.ADD_CURRENT_PAGE, addCurrentPage),
    takeLatest(bookmarkTypes.ADD_SEPARATOR, addSeparator),
    takeEvery(bookmarkTypes.DELETE_BOOKMARK, deleteBookmark),
    takeLatest(bookmarkTypes.GET_SEARCH_RESULT, getSearchResult),
    takeLatest(bookmarkTypes.INIT_BOOKMARK_TREES, initBookmarkTrees),
    takeLatest(bookmarkTypes.OPEN_BOOKMARKS, openBookmarks),
    takeLatest(bookmarkTypes.OPEN_BOOKMARK_TREE, openBookmarkTree),
    takeLatest(bookmarkTypes.REFRESH_BOOKMARK_TREES, refreshBookmarkTrees)
  ])
}
