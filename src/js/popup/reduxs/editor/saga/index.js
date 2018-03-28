// @flow

import type {Saga} from 'redux-saga'
import {all, takeLatest} from 'redux-saga/effects'

import {silenceSaga} from '../../../../common/utils'
import {editorTypes} from '../actions'
import {closeEditor} from './modules/closeEditor'
import {openEditor} from './modules/openEditor'

export function* editorSaga(): Saga<void> {
  yield all([
    takeLatest(editorTypes.CLOSE_EDITOR, silenceSaga(closeEditor)),
    takeLatest(editorTypes.OPEN_EDITOR, silenceSaga(openEditor))
  ])
}
