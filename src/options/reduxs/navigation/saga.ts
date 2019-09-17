import {put, takeLatest} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import * as optionsCreators from '../options/actions'
import * as navigationCreators from './actions'

function* switchNavModule() {
  try {
    yield put(optionsCreators.reloadOptions())
  } catch (err) {
    console.error(err)
  }
}

export function* navigationSaga() {
  yield takeLatest(getType(navigationCreators.switchNavModule), switchNavModule)
}
