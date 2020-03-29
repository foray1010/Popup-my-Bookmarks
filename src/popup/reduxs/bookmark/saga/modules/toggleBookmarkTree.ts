import * as R from 'ramda'
import { put, select } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'

import { RootState } from '../../../rootReducer'
import * as bookmarkCreators from '../../actions'

export function* toggleBookmarkTree({
  payload,
}: ActionType<typeof bookmarkCreators.toggleBookmarkTree>) {
  try {
    const { bookmark }: RootState = yield select(R.identity)

    const isFolderOpened = bookmark.trees.some(
      (tree) => tree.parent.id === payload.id,
    )

    if (isFolderOpened) {
      yield put(bookmarkCreators.removeNextBookmarkTrees(payload.parentId))
    } else {
      yield put(bookmarkCreators.openBookmarkTree(payload.id, payload.parentId))
    }
  } catch (err) {
    console.error(err)
  }
}
