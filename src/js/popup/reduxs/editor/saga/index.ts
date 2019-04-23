import {SagaIterator} from 'redux-saga'
import {all, takeLatest} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import {silenceSaga} from '../../../../common/utils'
import * as editorCreators from '../actions'
import {createFolderInEditor} from './modules/createFolderInEditor'
import {openEditor} from './modules/openEditor'

export function* editorSaga(): SagaIterator {
  yield all([
    takeLatest(getType(editorCreators.createFolderInEditor), silenceSaga(createFolderInEditor)),
    takeLatest(getType(editorCreators.openEditor), silenceSaga(openEditor))
  ])
}
