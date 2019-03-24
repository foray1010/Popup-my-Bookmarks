import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {actionChannel, call, fork, select, take, takeLatest} from 'redux-saga/effects'
import {ActionType, getType} from 'typesafe-actions'

import {setLocalStorage, silenceSaga} from '../../../common/utils'
import {RootState} from '../rootReducer'
import * as localStorageCreators from './actions'

function* createLastPosition({
  payload
}: ActionType<typeof localStorageCreators.createLastPosition>): SagaIterator {
  const {lastPositions}: RootState = yield select(R.identity)

  if (payload.index <= lastPositions.length) {
    const updatedLastPositions = [
      ...R.take(payload.index, lastPositions),
      {
        id: payload.id,
        scrollTop: 0
      }
    ]

    yield call(setLocalStorage, {
      lastPositions: updatedLastPositions
    })
  }
}

function* watchCreateLastPosition(): SagaIterator {
  const createLastPositionChan = yield actionChannel(
    getType(localStorageCreators.createLastPosition)
  )
  while (true) {
    const action = yield take(createLastPositionChan)

    yield call(createLastPosition, action)
  }
}

function* updateLastPosition({
  payload
}: ActionType<typeof localStorageCreators.updateLastPosition>): SagaIterator {
  const {lastPositions}: RootState = yield select(R.identity)

  const index = lastPositions.findIndex(R.propEq('id', payload.id))
  if (index >= 0) {
    const updatedLastPositions = R.update(index, payload, lastPositions)

    yield call(setLocalStorage, {
      lastPositions: updatedLastPositions
    })
  }
}

export function* lastPositionsSaga(): SagaIterator {
  yield fork(watchCreateLastPosition)

  yield takeLatest(
    getType(localStorageCreators.updateLastPosition),
    silenceSaga(updateLastPosition)
  )
}
