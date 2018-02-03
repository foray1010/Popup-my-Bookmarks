import {put, takeLatest} from 'redux-saga/effects'

import {optionsCreators} from '../options/actions'
import {navigationTypes} from './actions'

function* switchNavModule() {
  yield put(optionsCreators.reloadOptions())
}

export function* navigationSaga() {
  yield takeLatest(navigationTypes.SWITCH_NAV_MODULE, switchNavModule)
}
