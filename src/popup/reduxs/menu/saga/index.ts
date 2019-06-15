import {SagaIterator} from 'redux-saga'
import {takeLatest} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import * as menuCreators from '../actions'
import {clickMenuRow} from './modules/clickMenuRow'
import {openMenu} from './modules/openMenu'

export function* menuSaga(): SagaIterator {
  yield takeLatest(getType(menuCreators.clickMenuRow), clickMenuRow)
  yield takeLatest(getType(menuCreators.openMenu), openMenu)
}
