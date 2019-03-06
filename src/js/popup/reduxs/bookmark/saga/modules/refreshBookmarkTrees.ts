import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import {BookmarkTree} from '../../../../types'
import {RootState} from '../../../rootReducer'
import * as bookmarkCreators from '../../actions'
import {getBookmarkTrees} from '../utils/getters'

export const getRestTreeIds = (trees: Array<BookmarkTree>) =>
  R.tail(trees).map((tree) => tree.parent.id)

export function* refreshBookmarkTrees(): SagaIterator {
  const {bookmark, options}: RootState = yield select(R.identity)
  const {searchKeyword, trees} = bookmark

  if (searchKeyword) {
    yield put(bookmarkCreators.getSearchResult(searchKeyword))
  } else {
    const bookmarkTrees = yield call(getBookmarkTrees, getRestTreeIds(trees), options)
    yield put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
  }
}
