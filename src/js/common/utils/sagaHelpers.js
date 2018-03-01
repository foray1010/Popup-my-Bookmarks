// @flow

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {all, call, fork} from 'redux-saga/effects'

export const combineSagas = (sagas: $ReadOnlyArray<Saga<void>>) =>
  function* rootSaga(): Saga<void> {
    yield all(R.map(fork, sagas))
  }

// as one saga failed, all next saga actions will not be ran,
// this helper helps silent any error thrown from saga
export const silenceSaga = (saga: Saga<void>) =>
  function* silencedSaga(...args: $ReadOnlyArray<*>): Saga<void> {
    try {
      yield call(saga, ...args)
    } catch (err) {
      console.error(err)
    }
  }
