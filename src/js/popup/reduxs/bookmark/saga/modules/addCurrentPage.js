// @flow strict

import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {call, put} from 'redux-saga/effects'

import {queryTabs} from '../../../../../common/utils'
import {bookmarkCreators} from '../../actions'

export function* addCurrentPage({
  payload
}: ActionType<typeof bookmarkCreators.addCurrentPage>): Saga<void> {
  const [currentTab] = yield call(queryTabs, {
    currentWindow: true,
    active: true
  })

  yield put(
    bookmarkCreators.createBookmark(
      payload.parentId,
      payload.index,
      currentTab.title,
      currentTab.url
    )
  )
}
