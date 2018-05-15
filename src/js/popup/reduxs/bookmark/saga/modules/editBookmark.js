// @flow strict

import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {call} from 'redux-saga/effects'

import {updateBookmark} from '../../../../../common/utils'
import {bookmarkCreators} from '../../actions'

export function* editBookmark({
  payload
}: ActionType<typeof bookmarkCreators.editBookmark>): Saga<void> {
  yield call(updateBookmark, payload.id, {
    title: payload.title,
    ...(payload.url ? {url: payload.url} : null)
  })
}
