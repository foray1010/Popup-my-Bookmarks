import {SagaIterator} from 'redux-saga'
import {call, put} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {BookmarkTree} from '../../../../types'
import * as bookmarkCreators from '../../actions'
import {getBookmarkTree} from '../utils/getters'

export function* openFolderInBrowser({
  payload
}: ActionType<typeof bookmarkCreators.openFolderInBrowser>): SagaIterator {
  const bookmarkTree: BookmarkTree = yield call(getBookmarkTree, payload.id)

  const bookmarkIds = bookmarkTree.children.map((x) => x.id)

  yield put(bookmarkCreators.openBookmarksInBrowser(bookmarkIds, payload.openBookmarkProps))
}
