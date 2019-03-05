import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {all, call, put, select} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import * as bookmarkCreators from '../../actions'
import {getBookmarkTree} from '../utils/getters'

export const bookmarkTreesSelector = R.path(['bookmark', 'trees'])
const treeIdEquals = R.pathEq(['parent', 'id'])

export function* openBookmarkTree({
  payload
}: ActionType<typeof bookmarkCreators.openBookmarkTree>): SagaIterator {
  const [trees, bookmarkTree] = yield all([
    select(bookmarkTreesSelector),
    call(getBookmarkTree, payload.id)
  ])

  // if tree is already in view, no need to re-render
  if (trees.some(treeIdEquals(payload.id))) return

  const parentIndex = trees.findIndex(treeIdEquals(payload.parentId))
  // if parent doesn't exist, do not show this tree in the view
  if (parentIndex < 0) return

  yield put(bookmarkCreators.setBookmarkTrees([...trees.slice(0, parentIndex + 1), bookmarkTree]))
}
