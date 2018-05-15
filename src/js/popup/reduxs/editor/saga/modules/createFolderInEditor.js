// @flow strict

import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {put} from 'redux-saga/effects'

import {getI18n} from '../../../../../common/utils'
import {uiCreators} from '../../../ui/actions'
import {editorCreators} from '../../actions'

export function* createFolderInEditor({
  payload
}: ActionType<typeof editorCreators.createFolderInEditor>): Saga<void> {
  yield put(
    editorCreators.setEditor({
      ...payload.coordinates,
      isAllowEditUrl: false,
      isCreating: true,
      targetId: payload.targetId,
      title: getI18n('newFolder')
    })
  )
  yield put(uiCreators.setIsDisableGlobalKeyboardEvent(true))
}
