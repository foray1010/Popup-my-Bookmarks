import {all, takeLatest} from 'redux-saga/effects'

import {bookmarkTypes} from '../actions'
import {initBookmarkTrees} from './modules/initBookmarkTrees'
import {openBookmarkTree} from './modules/openBookmarkTree'

export function* bookmarkSaga() {
  yield all([
    takeLatest(bookmarkTypes.INIT_BOOKMARK_TREES, initBookmarkTrees),
    takeLatest(bookmarkTypes.OPEN_BOOKMARK_TREE, openBookmarkTree)
  ])
}
