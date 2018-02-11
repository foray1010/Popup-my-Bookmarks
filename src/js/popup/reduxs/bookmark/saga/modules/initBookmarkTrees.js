import {call, put, select} from 'redux-saga/effects'
import store from 'store'

import {bookmarkCreators} from '../../actions'
import {getBookmarkTrees} from '../utils/getters'

export function* initBookmarkTrees() {
  try {
    const {options} = yield select()

    const bookmarkTrees = yield call(
      getBookmarkTrees,
      options.rememberPos ? store.get('lastBoxPID') || [] : [],
      options
    )

    yield put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
  } catch (err) {
    console.error(err)
  }
}
