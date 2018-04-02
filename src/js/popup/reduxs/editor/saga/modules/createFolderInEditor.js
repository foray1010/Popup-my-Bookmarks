// @flow

import type {Saga} from 'redux-saga'
import {put} from 'redux-saga/effects'

import {getI18n} from '../../../../../common/utils'
import {uiCreators} from '../../../ui/actions'
import {editorCreators} from '../../actions'

type Payload = {|
  coordinates: {|
    positionLeft: number,
    positionTop: number
  |},
  targetId: string
|}
export function* createFolderInEditor({coordinates, targetId}: Payload): Saga<void> {
  yield put(
    editorCreators.setEditor({
      ...coordinates,
      isAllowEditUrl: false,
      isCreating: true,
      targetId,
      title: getI18n('newFolder')
    })
  )
  yield put(uiCreators.setIsDisableGlobalKeyboardEvent(true))
}
