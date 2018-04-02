// @flow

import type {Saga} from 'redux-saga'
import {call, put} from 'redux-saga/effects'

import {bookmarkCreators} from '../../actions'
import {getBookmarkInfo} from '../utils/getters'

type Payload = {|
  id: string,
  title: string,
  url: string
|}
export function* createBookmarkAfterId({id, title, url}: Payload): Saga<void> {
  const bookmarkInfo = yield call(getBookmarkInfo, id)

  yield put(
    bookmarkCreators.createBookmark(
      bookmarkInfo.parentId,
      bookmarkInfo.storageIndex + 1,
      title,
      url
    )
  )
}
