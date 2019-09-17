import {takeLatest} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import * as editorCreators from '../actions'
import {createFolderInEditor} from './modules/createFolderInEditor'
import {openEditor} from './modules/openEditor'

export function* editorSaga() {
  yield takeLatest(getType(editorCreators.createFolderInEditor), createFolderInEditor)
  yield takeLatest(getType(editorCreators.openEditor), openEditor)
}
