import {call, put} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {BookmarkTree} from '../../../../types'
import * as bookmarkCreators from '../../actions'
import {getBookmarkTree} from '../utils/getters'

export function* openFolderInBrowser({
  payload
}: ActionType<typeof bookmarkCreators.openFolderInBrowser>) {
  try {
    const bookmarkTree: BookmarkTree = yield call(getBookmarkTree, payload.id)

    const bookmarkIds = bookmarkTree.children.map(x => x.id)

    yield put(bookmarkCreators.openBookmarksInBrowser(bookmarkIds, payload.openBookmarkProps))
  } catch (err) {
    console.error(err)
  }
}
