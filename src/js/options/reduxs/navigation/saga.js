import {takeLatest} from 'redux-saga/effects'

import {reloadOptions} from '../options/saga'
import {navigationTypes} from './actions'

export function* navigationSaga() {
  yield takeLatest(navigationTypes.SWITCH_NAV_MODULE, reloadOptions)
}
