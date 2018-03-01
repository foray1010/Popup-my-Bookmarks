// @flow

import type {Saga} from 'redux-saga'
import {call} from 'redux-saga/effects'

import {createBookmark, queryTabs} from '../../../../../common/utils'

type Payload = {|
  index: number,
  parentId: string
|}
export function* addCurrentPage({parentId, index}: Payload): Saga<void> {
  const [currentTab] = yield call(queryTabs, {
    currentWindow: true,
    active: true
  })

  yield call(createBookmark, {
    index,
    parentId,
    title: currentTab.title.trim(),
    url: currentTab.url && currentTab.url.trim()
  })
}
