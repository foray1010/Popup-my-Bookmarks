import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {all, call, fork} from 'redux-saga/effects'

type SagaGeneratorFn = (...args: Array<any>) => SagaIterator

export const combineSagas = (sagas: Array<SagaGeneratorFn>) =>
  function* rootSaga(): SagaIterator {
    yield all(R.map(fork, sagas))
  }

// as one saga failed, all next saga actions will not be ran,
// this helper helps silent any error thrown from saga
export const silenceSaga = (saga: SagaGeneratorFn) =>
  function* silencedSaga(...args: Array<any>): SagaIterator {
    try {
      yield call(saga, ...args)
    } catch (err) {
      console.error(err)
    }
  }
