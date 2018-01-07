import {takeLatest} from 'redux-saga/effects'

import {reloadOptions} from './optionsSaga'
import {Types as navigationTypes} from '../reduxs/navigationRedux'

export default function* navigationSaga() {
  yield takeLatest(navigationTypes.SWITCH_NAV_MODULE, reloadOptions)
}
