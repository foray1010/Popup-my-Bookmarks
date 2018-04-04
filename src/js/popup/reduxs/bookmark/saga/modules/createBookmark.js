// @flow

import type {Saga} from 'redux-saga'
import {call} from 'redux-saga/effects'

import {createBookmark as createBookmarkWrapper} from '../../../../../common/utils'

type Payload = {|
  index: number,
  parentId: string,
  title: string,
  url: string
|}
export function* createBookmark({
  index, parentId, title, url = ''
}: Payload): Saga<void> {
  const trimmedUrl = url.trim()

  yield call(createBookmarkWrapper, {
    index,
    parentId,
    title: title.trim(),
    ...(trimmedUrl ? {url: trimmedUrl} : null)
  })
}
