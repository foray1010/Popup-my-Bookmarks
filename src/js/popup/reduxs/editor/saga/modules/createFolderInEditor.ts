import {SagaIterator} from 'redux-saga'
import {call, put} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {getI18n} from '../../../../../common/utils'
import * as uiCreators from '../../../ui/actions'
import * as editorCreators from '../../actions'

export function* createFolderInEditor({
  payload
}: ActionType<typeof editorCreators.createFolderInEditor>): SagaIterator {
  yield put(
    editorCreators.setEditor({
      ...payload.coordinates,
      isAllowEditUrl: false,
      isCreating: true,
      targetId: payload.targetId,
      title: yield call(getI18n, 'newFolder')
    })
  )
  yield put(uiCreators.setIsDisableGlobalKeyboardEvent(true))
}
