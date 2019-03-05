import {SagaIterator} from 'redux-saga'
import {call} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {updateBookmark} from '../../../../../common/utils'
import * as bookmarkCreators from '../../actions'

export function* editBookmark({
  payload
}: ActionType<typeof bookmarkCreators.editBookmark>): SagaIterator {
  yield call(updateBookmark, payload.id, {
    title: payload.title,
    ...(payload.url ? {url: payload.url} : null)
  })
}
