import R from 'ramda'
import {all, fork} from 'redux-saga/effects'

import navigationSaga from './navigationSaga'
import optionsSaga from './optionsSaga'

export default function* rootSaga() {
  yield all(R.map(fork, [navigationSaga, optionsSaga]))
}
