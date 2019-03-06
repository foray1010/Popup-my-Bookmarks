import {SagaIterator} from 'redux-saga'
import {all, takeLatest} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import {silenceSaga} from '../../../../common/utils'
import * as menuCreators from '../actions'
import {clickMenuRow} from './modules/clickMenuRow'
import {closeMenu} from './modules/closeMenu'
import {openMenu} from './modules/openMenu'

export function* menuSaga(): SagaIterator {
  yield all([
    takeLatest(getType(menuCreators.clickMenuRow), silenceSaga(clickMenuRow)),
    takeLatest(getType(menuCreators.closeMenu), silenceSaga(closeMenu)),
    takeLatest(getType(menuCreators.openMenu), silenceSaga(openMenu))
  ])
}
