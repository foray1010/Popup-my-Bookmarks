// @flow

import type {Saga} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'
import store from 'store'

import {bookmarkCreators} from '../../actions'
import {getBookmarkTrees} from '../utils/getters'

export function* initBookmarkTrees(): Saga<void> {
  try {
    const {options} = yield select()

    const treeIds = options.rememberPos ? (yield call([store, store.get], 'lastBoxPID')) || [] : []

    const bookmarkTrees = yield call(getBookmarkTrees, treeIds, options)

    yield put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
  } catch (err) {
    console.error(err)
  }
}
