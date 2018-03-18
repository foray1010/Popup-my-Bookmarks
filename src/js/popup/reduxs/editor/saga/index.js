// @flow

import type {Saga} from 'redux-saga'
import {takeLatest} from 'redux-saga/effects'

import {silenceSaga} from '../../../../common/utils'
import {editorTypes} from '../actions'
import {openEditor} from './modules/openEditor'

export function* editorSaga(): Saga<void> {
  yield takeLatest(editorTypes.OPEN_EDITOR, silenceSaga(openEditor))
}
