// @flow strict

import type {Saga} from 'redux-saga'
import {call, put} from 'redux-saga/effects'

import {queryTabs} from '../../../../../common/utils'
import {bookmarkCreators} from '../../actions'

type Payload = {|
  index: number,
  parentId: string
|}
export function* addCurrentPage({index, parentId}: Payload): Saga<void> {
  const [currentTab] = yield call(queryTabs, {
    currentWindow: true,
    active: true
  })

  yield put(bookmarkCreators.createBookmark(parentId, index, currentTab.title, currentTab.url))
}
