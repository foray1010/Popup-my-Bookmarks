import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {all, call, put, select} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {BookmarkTree} from '../../../../types'
import {RootState} from '../../../rootReducer'
import * as bookmarkCreators from '../../actions'
import {getBookmarkTree} from '../utils/getters'

export const bookmarkTreesSelector = (state: RootState) => state.bookmark.trees
const treeIdEquals = R.pathEq(['parent', 'id'])

export function* openBookmarkTree({
  payload
}: ActionType<typeof bookmarkCreators.openBookmarkTree>): SagaIterator {
  try {
    const [trees, bookmarkTree]: [Array<BookmarkTree>, BookmarkTree] = yield all([
      select(bookmarkTreesSelector),
      call(getBookmarkTree, payload.id)
    ])

    // if tree is already in view, no need to re-render
    if (trees.some(treeIdEquals(payload.id))) return

    const parentIndex = trees.findIndex(treeIdEquals(payload.parentId))
    // if parent doesn't exist, do not show this tree in the view
    if (parentIndex < 0) return

    yield put(bookmarkCreators.setBookmarkTrees([...trees.slice(0, parentIndex + 1), bookmarkTree]))
  } catch (err) {
    console.error(err)
  }
}
