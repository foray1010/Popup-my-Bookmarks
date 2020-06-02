import { call, put } from 'redux-saga/effects'
import type { ActionType } from 'typesafe-actions'

import type { BookmarkInfo } from '../../../../types'
import * as bookmarkCreators from '../../actions'
import { getBookmarkInfo } from '../utils/getters'

export function* createBookmarkAfterId({
  payload,
}: ActionType<typeof bookmarkCreators.createBookmarkAfterId>) {
  try {
    const bookmarkInfo: BookmarkInfo = yield call(getBookmarkInfo, payload.id)

    yield put(
      bookmarkCreators.createBookmark(
        bookmarkInfo.parentId,
        bookmarkInfo.storageIndex + 1,
        payload.title,
        payload.url,
      ),
    )
  } catch (err) {
    console.error(err)
  }
}
