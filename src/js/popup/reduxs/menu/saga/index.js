// @flow

import type {Saga} from 'redux-saga'
import {all, takeLatest} from 'redux-saga/effects'

import {silenceSaga} from '../../../../common/utils'
import {menuTypes} from '../actions'
import {clickMenuRow} from './modules/clickMenuRow'
import {openMenu} from './modules/openMenu'

export function* menuSaga(): Saga<void> {
  yield all([
    takeLatest(menuTypes.CLICK_MENU_ROW, silenceSaga(clickMenuRow)),
    takeLatest(menuTypes.OPEN_MENU, silenceSaga(openMenu))
  ])
}
