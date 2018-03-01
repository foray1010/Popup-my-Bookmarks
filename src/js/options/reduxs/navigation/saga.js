// @flow

import type {Saga} from 'redux-saga'
import {put, takeLatest} from 'redux-saga/effects'

import {silenceSaga} from '../../../common/utils'
import {optionsCreators} from '../options/actions'
import {navigationTypes} from './actions'

function* switchNavModule(): Saga<void> {
  yield put(optionsCreators.reloadOptions())
}

export function* navigationSaga(): Saga<void> {
  yield takeLatest(navigationTypes.SWITCH_NAV_MODULE, silenceSaga(switchNavModule))
}
