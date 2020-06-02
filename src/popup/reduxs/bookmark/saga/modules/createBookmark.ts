import { call } from 'redux-saga/effects'
import type { ActionType } from 'typesafe-actions'

import { createBookmark as createBookmarkWrapper } from '../../../../../core/utils'
import type * as bookmarkCreators from '../../actions'

export function* createBookmark({
  payload,
}: ActionType<typeof bookmarkCreators.createBookmark>) {
  try {
    const trimmedUrl = payload.url.trim()

    yield call(createBookmarkWrapper, {
      index: payload.index,
      parentId: payload.parentId,
      title: payload.title.trim(),
      ...(trimmedUrl ? { url: trimmedUrl } : null),
    })
  } catch (err) {
    console.error(err)
  }
}
