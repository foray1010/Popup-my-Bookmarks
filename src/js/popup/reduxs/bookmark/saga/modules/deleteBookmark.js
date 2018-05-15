// @flow strict

import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {call} from 'redux-saga/effects'

import {removeBookmark, removeBookmarkTree} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import {bookmarkCreators} from '../../actions'
import {getBookmarkInfo} from '../utils/getters'

export function* deleteBookmark({
  payload
}: ActionType<typeof bookmarkCreators.deleteBookmark>): Saga<void> {
  const bookmarkInfo = yield call(getBookmarkInfo, payload.id)

  if (bookmarkInfo.type === CST.TYPE_FOLDER) {
    yield call(removeBookmarkTree, payload.id)
  } else {
    yield call(removeBookmark, payload.id)
  }
}
