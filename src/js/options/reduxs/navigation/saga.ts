import {SagaIterator} from 'redux-saga'
import {put, takeLatest} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import {silenceSaga} from '../../../common/utils'
import * as optionsCreators from '../options/actions'
import * as navigationCreators from './actions'

function* switchNavModule(): SagaIterator {
  yield put(optionsCreators.reloadOptions())
}

export function* navigationSaga(): SagaIterator {
  yield takeLatest(getType(navigationCreators.switchNavModule), silenceSaga(switchNavModule))
}
