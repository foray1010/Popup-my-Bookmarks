// @flow strict

import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {call} from 'redux-saga/effects'

import {createBookmark as createBookmarkWrapper} from '../../../../../common/utils'
import {bookmarkCreators} from '../../actions'

export function* createBookmark({
  payload
}: ActionType<typeof bookmarkCreators.createBookmark>): Saga<void> {
  const trimmedUrl = payload.url.trim()

  yield call(createBookmarkWrapper, {
    index: payload.index,
    parentId: payload.parentId,
    title: payload.title.trim(),
    ...(trimmedUrl ? {url: trimmedUrl} : null)
  })
}
