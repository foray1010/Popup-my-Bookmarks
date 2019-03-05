import {SagaIterator} from 'redux-saga'
import {call} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {createBookmark as createBookmarkWrapper} from '../../../../../common/utils'
import * as bookmarkCreators from '../../actions'

export function* createBookmark({
  payload
}: ActionType<typeof bookmarkCreators.createBookmark>): SagaIterator {
  const trimmedUrl = payload.url.trim()

  yield call(createBookmarkWrapper, {
    index: payload.index,
    parentId: payload.parentId,
    title: payload.title.trim(),
    ...(trimmedUrl ? {url: trimmedUrl} : null)
  })
}
