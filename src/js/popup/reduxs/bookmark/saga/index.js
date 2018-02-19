import {all, takeLatest} from 'redux-saga/effects'

import {bookmarkTypes} from '../actions'
import {getSearchResult} from './modules/getSearchResult'
import {initBookmarkTrees} from './modules/initBookmarkTrees'
import {openBookmarkTree} from './modules/openBookmarkTree'
import {refreshBookmarkTrees} from './modules/refreshBookmarkTrees'

export function* bookmarkSaga() {
  yield all([
    takeLatest(bookmarkTypes.GET_SEARCH_RESULT, getSearchResult),
    takeLatest(bookmarkTypes.INIT_BOOKMARK_TREES, initBookmarkTrees),
    takeLatest(bookmarkTypes.OPEN_BOOKMARK_TREE, openBookmarkTree),
    takeLatest(bookmarkTypes.REFRESH_BOOKMARK_TREES, refreshBookmarkTrees)
  ])
}
