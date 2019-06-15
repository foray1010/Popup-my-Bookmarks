import {SagaIterator} from 'redux-saga'
import {call} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {updateBookmark} from '../../../../../core/utils'
import * as bookmarkCreators from '../../actions'

export function* editBookmark({
  payload
}: ActionType<typeof bookmarkCreators.editBookmark>): SagaIterator {
  try {
    yield call(updateBookmark, payload.id, {
      title: payload.title,
      ...(payload.url ? {url: payload.url} : null)
    })
  } catch (err) {
    console.error(err)
  }
}
