import R from 'ramda'
import {all, fork} from 'redux-saga/effects'

export default (sagas) =>
  function* rootSaga() {
    yield all(R.map(fork, sagas))
  }
