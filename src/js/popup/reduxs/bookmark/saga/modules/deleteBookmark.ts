import {SagaIterator} from 'redux-saga'
import {call} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {removeBookmark, removeBookmarkTree} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import {BookmarkInfo} from '../../../../types'
import * as bookmarkCreators from '../../actions'
import {getBookmarkInfo} from '../utils/getters'

export function* deleteBookmark({
  payload
}: ActionType<typeof bookmarkCreators.deleteBookmark>): SagaIterator {
  const bookmarkInfo: BookmarkInfo = yield call(getBookmarkInfo, payload.id)

  if (bookmarkInfo.type === CST.BOOKMARK_TYPES.FOLDER) {
    yield call(removeBookmarkTree, payload.id)
  } else {
    yield call(removeBookmark, payload.id)
  }
}
