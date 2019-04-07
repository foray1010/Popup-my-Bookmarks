import {SagaIterator} from 'redux-saga'
import {call, put} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {getBookmarkInfo} from '../../../bookmark/saga/utils/getters'
import * as editorCreators from '../../actions'

export function* openEditor({payload}: ActionType<typeof editorCreators.openEditor>): SagaIterator {
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
}
