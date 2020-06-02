import { call } from 'redux-saga/effects'
import type { ActionType } from 'typesafe-actions'

import { updateBookmark } from '../../../../../core/utils'
import type * as bookmarkCreators from '../../actions'

export function* editBookmark({
  payload,
}: ActionType<typeof bookmarkCreators.editBookmark>) {
  try {
    yield call(updateBookmark, payload.id, {
      title: payload.title,
      ...(payload.url ? { url: payload.url } : null),
    })
  } catch (err) {
    console.error(err)
  }
}
