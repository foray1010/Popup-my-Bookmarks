// @flow

import type {Saga} from 'redux-saga'
import {put} from 'redux-saga/effects'

import * as CST from '../../../../constants'
import {bookmarkCreators} from '../../actions'

type Payload = {|
  index: number,
  parentId: string
|}
export function* addSeparator({index, parentId}: Payload): Saga<void> {
  yield put(
    bookmarkCreators.createBookmark(parentId, index, '- '.repeat(42), CST.SEPARATE_THIS_URL)
  )
}
