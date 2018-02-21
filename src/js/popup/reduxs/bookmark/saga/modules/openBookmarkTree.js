// @flow

import type {Saga} from 'redux-saga'
import {call, put} from 'redux-saga/effects'

import {bookmarkCreators} from '../../actions'
import {getBookmarkTree} from '../utils/getters'

type Payload = {
  id: string,
  index: number
};
export function* openBookmarkTree({id, index}: Payload): Saga<void> {
  try {
    const bookmarkTree = yield call(getBookmarkTree, id)
    yield put(bookmarkCreators.spliceBookmarkTrees(index, [bookmarkTree]))
  } catch (err) {
    console.error(err)
  }
}
