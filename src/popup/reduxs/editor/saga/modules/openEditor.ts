import { call, put } from 'redux-saga/effects'
import type { ActionType } from 'typesafe-actions'

import type { BookmarkInfo } from '../../../../types'
import { getBookmarkInfo } from '../../../bookmark/saga/utils/getters'
import * as editorCreators from '../../actions'

export function* openEditor({
  payload,
}: ActionType<typeof editorCreators.openEditor>) {
  try {
    const bookmarkInfo: BookmarkInfo = yield call(
      getBookmarkInfo,
      payload.targetId,
    )

    yield put(
      editorCreators.setEditor({
        ...payload.coordinates,
        isAllowEditUrl: Boolean(bookmarkInfo.url),
        targetId: payload.targetId,
        title: bookmarkInfo.title,
        url: bookmarkInfo.url,
      }),
    )
  } catch (err) {
    console.error(err)
  }
}
