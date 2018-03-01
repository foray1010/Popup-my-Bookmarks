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
import {openBookmarks} from './modules/openBookmarks'
import {openBookmarkTree} from './modules/openBookmarkTree'
import {refreshBookmarkTrees} from './modules/refreshBookmarkTrees'

export function* bookmarkSaga(): Saga<void> {
  yield all([
    takeLatest(bookmarkTypes.ADD_CURRENT_PAGE, silenceSaga(addCurrentPage)),
    takeLatest(bookmarkTypes.ADD_SEPARATOR, silenceSaga(addSeparator)),
    takeEvery(bookmarkTypes.DELETE_BOOKMARK, silenceSaga(deleteBookmark)),
    takeLatest(bookmarkTypes.GET_SEARCH_RESULT, silenceSaga(getSearchResult)),
    takeLatest(bookmarkTypes.INIT_BOOKMARK_TREES, silenceSaga(initBookmarkTrees)),
    takeLatest(bookmarkTypes.OPEN_BOOKMARKS, silenceSaga(openBookmarks)),
    takeLatest(bookmarkTypes.OPEN_BOOKMARK_TREE, silenceSaga(openBookmarkTree)),
    takeLatest(bookmarkTypes.REFRESH_BOOKMARK_TREES, silenceSaga(refreshBookmarkTrees))
  ])
}
