import {SagaIterator} from 'redux-saga'
import {put} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import * as CST from '../../../../constants'
import * as bookmarkCreators from '../../actions'

export function* addSeparator({
  payload
}: ActionType<typeof bookmarkCreators.addSeparator>): SagaIterator {
  try {
    yield put(
      bookmarkCreators.createBookmark(
        payload.parentId,
        payload.index,
        '- '.repeat(42),
        CST.SEPARATE_THIS_URL
      )
    )
  } catch (err) {
    console.error(err)
  }
}
