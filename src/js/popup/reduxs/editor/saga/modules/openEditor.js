// @flow strict

import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {call, put} from 'redux-saga/effects'

import {getBookmarkInfo} from '../../../bookmark/saga/utils/getters'
import {uiCreators} from '../../../ui/actions'
import {editorCreators} from '../../actions'

export function* openEditor({payload}: ActionType<typeof editorCreators.openEditor>): Saga<void> {
  const bookmarkInfo = yield call(getBookmarkInfo, payload.targetId)

  yield put(
    editorCreators.setEditor({
      ...payload.coordinates,
      isAllowEditUrl: Boolean(bookmarkInfo.url),
      targetId: payload.targetId,
      title: bookmarkInfo.title,
      url: bookmarkInfo.url
    })
  )
  yield put(uiCreators.setIsDisableGlobalKeyboardEvent(true))
}
