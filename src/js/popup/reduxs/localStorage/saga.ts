import {SagaIterator} from 'redux-saga'
import {call, takeLatest} from 'redux-saga/effects'
import {ActionType, getType} from 'typesafe-actions'

import {setLocalStorage, silenceSaga} from '../../../common/utils'
import * as localStorageCreators from './actions'

function* updateLocalStorage({
  payload
}: ActionType<typeof localStorageCreators.updateLocalStorage>): SagaIterator {
  yield call(setLocalStorage, payload)
}

export function* localStorageSaga(): SagaIterator {
  yield takeLatest(
    getType(localStorageCreators.updateLocalStorage),
    silenceSaga(updateLocalStorage)
  )
}
