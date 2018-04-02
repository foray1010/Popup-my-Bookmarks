// @flow

import type {Saga} from 'redux-saga'
import {all, takeLatest} from 'redux-saga/effects'

import {silenceSaga} from '../../../../common/utils'
import {editorTypes} from '../actions'
import {closeEditor} from './modules/closeEditor'
import {createFolderInEditor} from './modules/createFolderInEditor'
import {openEditor} from './modules/openEditor'

export function* editorSaga(): Saga<void> {
  yield all([
    takeLatest(editorTypes.CLOSE_EDITOR, silenceSaga(closeEditor)),
    takeLatest(editorTypes.CREATE_FOLDER_IN_EDITOR, silenceSaga(createFolderInEditor)),
    takeLatest(editorTypes.OPEN_EDITOR, silenceSaga(openEditor))
  ])
}
