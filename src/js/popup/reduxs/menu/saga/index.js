// @flow

import type {Saga} from 'redux-saga'
import {all, takeLatest} from 'redux-saga/effects'

import {menuTypes} from '../actions'
import {clickMenuRow} from './modules/clickMenuRow'
import {openMenu} from './modules/openMenu'

export function* menuSaga(): Saga<void> {
  yield all([
    takeLatest(menuTypes.CLICK_MENU_ROW, clickMenuRow),
    takeLatest(menuTypes.OPEN_MENU, openMenu)
  ])
}
