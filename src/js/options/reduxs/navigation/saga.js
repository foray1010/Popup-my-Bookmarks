import {put, takeLatest} from 'redux-saga/effects'

import {optionsCreators} from '../options/actions'
import {navigationTypes} from './actions'

function* switchNavModule() {
  try {
    yield put(optionsCreators.reloadOptions())
  } catch (err) {
    console.error(err)
  }
}

export function* navigationSaga() {
  yield takeLatest(navigationTypes.SWITCH_NAV_MODULE, switchNavModule)
}
