// @flow strict

import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {call, put} from 'redux-saga/effects'

import {bookmarkCreators} from '../../actions'
import {getBookmarkInfo} from '../utils/getters'

export function* createBookmarkAfterId({
  payload
}: ActionType<typeof bookmarkCreators.createBookmarkAfterId>): Saga<void> {
  const bookmarkInfo = yield call(getBookmarkInfo, payload.id)

  yield put(
    bookmarkCreators.createBookmark(
      bookmarkInfo.parentId,
      bookmarkInfo.storageIndex + 1,
      payload.title,
      payload.url
    )
  )
}
