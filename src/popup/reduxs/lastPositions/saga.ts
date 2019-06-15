import * as R from 'ramda'
import {SagaIterator, TakeableChannel} from 'redux-saga'
import {actionChannel, call, fork, race, take, takeLatest} from 'redux-saga/effects'
import {ActionType, getType} from 'typesafe-actions'

import {getLocalStorage, setLocalStorage} from '../../../core/utils'
import {LocalStorage} from '../../types/localStorage'
import * as lastPositionsCreator from './actions'

function* createLastPosition({
  payload
}: ActionType<typeof lastPositionsCreator.createLastPosition>): SagaIterator {
  try {
    const {lastPositions = []}: LocalStorage = yield call(getLocalStorage)

    if (payload.index <= lastPositions.length) {
      if (lastPositions[payload.index] && lastPositions[payload.index].id === payload.id) {
        return
      }

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
  } catch (err) {
    console.error(err)
  }
}

function* removeLastPosition({
  payload
}: ActionType<typeof lastPositionsCreator.removeLastPosition>): SagaIterator {
  try {
    const {lastPositions = []}: LocalStorage = yield call(getLocalStorage)

    if (payload.index <= lastPositions.length - 1) {
      const updatedLastPositions = R.take(payload.index, lastPositions)

      yield call(setLocalStorage, {
        lastPositions: updatedLastPositions
      })
    }
  } catch (err) {
    console.error(err)
  }
}

// use channel to make sure every create/remove run one by one
function* watchCreateAndRemoveLastPosition(): SagaIterator {
  try {
    const createLastPositionChan: TakeableChannel<{}> = yield actionChannel(
      getType(lastPositionsCreator.createLastPosition)
    )
    const removeLastPositionChan: TakeableChannel<{}> = yield actionChannel(
      getType(lastPositionsCreator.removeLastPosition)
    )
    while (true) {
      const [createLastPositionAction, removeLastPositionAction]: [
        ReturnType<typeof lastPositionsCreator.createLastPosition> | void,
        ReturnType<typeof lastPositionsCreator.removeLastPosition> | void
      ] = yield race([take(createLastPositionChan), take(removeLastPositionChan)])

      if (createLastPositionAction) {
        yield call(createLastPosition, createLastPositionAction)
      }

      if (removeLastPositionAction) {
        yield call(removeLastPosition, removeLastPositionAction)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

function* updateLastPosition({
  payload
}: ActionType<typeof lastPositionsCreator.updateLastPosition>): SagaIterator {
  try {
    const {lastPositions = []}: LocalStorage = yield call(getLocalStorage)

    const index = lastPositions.findIndex(R.propEq('id', payload.id))
    if (index >= 0) {
      const updatedLastPositions = R.update(index, payload, lastPositions)

      yield call(setLocalStorage, {
        lastPositions: updatedLastPositions
      })
    }
  } catch (err) {
    console.error(err)
  }
}

export function* lastPositionsSaga(): SagaIterator {
  try {
    yield fork(watchCreateAndRemoveLastPosition)

    yield takeLatest(getType(lastPositionsCreator.updateLastPosition), updateLastPosition)
  } catch (err) {
    console.error(err)
  }
}
