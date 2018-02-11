import * as R from 'ramda'
import {call, put, select} from 'redux-saga/effects'

import {bookmarkCreators} from '../../actions'
import {getBookmarkTrees} from '../utils/getters'

const getTailTreeIds = R.compose(R.tail, R.map(R.prop('id')))

export function* refreshBookmarkTrees() {
  try {
    const {bookmark, options} = yield select()
    const {searchKeyword, trees} = bookmark

    if (searchKeyword) {
      yield put(bookmarkCreators.getSearchResult(searchKeyword, options))
    } else {
      const bookmarkTrees = yield call(getBookmarkTrees, getTailTreeIds(trees), options)
      yield put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
    }
  } catch (err) {
    console.error(err)
  }
}
