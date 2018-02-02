import {takeLatest} from 'redux-saga/effects'

import {Types as navigationTypes} from '../reduxs/navigationRedux'
import {reloadOptions} from './optionsSaga'

export default function* navigationSaga() {
  yield takeLatest(navigationTypes.SWITCH_NAV_MODULE, reloadOptions)
}
