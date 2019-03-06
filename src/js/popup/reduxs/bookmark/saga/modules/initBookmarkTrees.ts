import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'
import store from 'store'

import * as bookmarkCreators from '../../actions'
import {getBookmarkTrees} from '../utils/getters'

export function* initBookmarkTrees(): SagaIterator {
  const {options} = yield select(R.identity)

  const treeIds = options.rememberPos ? (yield call([store, store.get], 'lastBoxPID')) || [] : []

  const bookmarkTrees = yield call(getBookmarkTrees, treeIds, options)

  yield put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
}
