// @flow

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {all, call, put, select} from 'redux-saga/effects'

import {bookmarkCreators} from '../../actions'
import {getBookmarkTree} from '../utils/getters'

export const bookmarkTreesSelector = R.path(['bookmark', 'trees'])
const treeIdEquals = R.pathEq(['parent', 'id'])

type Payload = {|
  id: string,
  parentId: string
|}
export function* openBookmarkTree({id, parentId}: Payload): Saga<void> {
  const [trees, bookmarkTree] = yield all([
    select(bookmarkTreesSelector),
    call(getBookmarkTree, id)
  ])

  // if tree is already in view, no need to re-render
  if (trees.some(treeIdEquals(id))) return

  const parentIndex = trees.findIndex(treeIdEquals(parentId))
  // if parent doesn't exist, do not show this tree in the view
  if (parentIndex < 0) return

  yield put(bookmarkCreators.setBookmarkTrees([...trees.slice(0, parentIndex + 1), bookmarkTree]))
}
