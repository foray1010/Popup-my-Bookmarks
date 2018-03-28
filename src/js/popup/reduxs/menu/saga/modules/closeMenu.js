// @flow

import type {Saga} from 'redux-saga'
import {put} from 'redux-saga/effects'

import {uiCreators} from '../../../ui/actions'

export function* closeMenu(): Saga<void> {
  yield put(uiCreators.setIsDisableGlobalKeyboardEvent(false))
}
