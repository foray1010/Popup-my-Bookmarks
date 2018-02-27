// @flow

import type {Saga} from 'redux-saga'
import {takeLatest} from 'redux-saga/effects'

import {menuTypes} from '../actions'
import {openMenu} from './modules/openMenu'

export function* menuSaga(): Saga<void> {
  yield takeLatest(menuTypes.OPEN_MENU, openMenu)
}
