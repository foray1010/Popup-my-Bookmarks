import {call, put} from 'redux-saga/effects'

import {bookmarkCreators} from '../../actions'
import {getBookmarkTree} from '../utils/getters'

export function* openBookmarkTree({id, index}) {
  try {
    const bookmarkTree = yield call(getBookmarkTree, id)
    yield put(bookmarkCreators.spliceBookmarkTrees(index, [bookmarkTree]))
  } catch (err) {
    console.error(err)
  }
}
