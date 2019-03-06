import {SagaIterator} from 'redux-saga'
import {call, put} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import * as bookmarkCreators from '../../actions'
import {getBookmarkInfo} from '../utils/getters'

export function* createBookmarkAfterId({
  payload
}: ActionType<typeof bookmarkCreators.createBookmarkAfterId>): SagaIterator {
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
