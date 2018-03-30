// @flow

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import {bookmarkCreators} from '../../actions'
import {getBookmarkTrees} from '../utils/getters'

export const getTailTreeIds = R.compose(R.tail, R.map(R.path(['parent', 'id'])))

export function* refreshBookmarkTrees(): Saga<void> {
  const {bookmark, options} = yield select(R.identity)
  const {searchKeyword, trees} = bookmark

  if (searchKeyword) {
    yield put(bookmarkCreators.getSearchResult(searchKeyword))
  } else {
    const bookmarkTrees = yield call(getBookmarkTrees, getTailTreeIds(trees), options)
    yield put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
  }
}
