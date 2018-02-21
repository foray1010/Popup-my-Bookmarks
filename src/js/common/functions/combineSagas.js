// @flow

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {all, fork} from 'redux-saga/effects'

export default (sagas: Array<Saga<void>>) =>
  function* rootSaga(): Saga<void> {
    yield all(R.map(fork, sagas))
  }
