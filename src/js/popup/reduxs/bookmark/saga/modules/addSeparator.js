// @flow strict

import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {put} from 'redux-saga/effects'

import * as CST from '../../../../constants'
import {bookmarkCreators} from '../../actions'

export function* addSeparator({
  payload
}: ActionType<typeof bookmarkCreators.addSeparator>): Saga<void> {
  yield put(
    bookmarkCreators.createBookmark(
      payload.parentId,
      payload.index,
      '- '.repeat(42),
      CST.SEPARATE_THIS_URL
    )
  )
}
