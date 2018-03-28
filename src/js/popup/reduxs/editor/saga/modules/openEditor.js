// @flow

import type {Saga} from 'redux-saga'
import {call, put} from 'redux-saga/effects'

import {getBookmarkInfo} from '../../../bookmark/saga/utils/getters'
import {uiCreators} from '../../../ui/actions'
import {editorCreators} from '../../actions'

type Payload = {|
  coordinates: {|
    positionLeft: number,
    positionTop: number
  |},
  isCreating: boolean,
  targetId: string
|}
export function* openEditor({coordinates, isCreating = false, targetId}: Payload): Saga<void> {
  const bookmarkInfo = yield call(getBookmarkInfo, targetId)

  yield put(
    editorCreators.setEditor({
      ...coordinates,
      isAllowEditUrl: Boolean(bookmarkInfo.url),
      isCreating,
      targetId,
      title: bookmarkInfo.title,
      url: bookmarkInfo.url
    })
  )
  yield put(uiCreators.setIsDisableGlobalKeyboardEvent(true))
}
