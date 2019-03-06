import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import * as CST from '../../../../constants'
import * as bookmarkCreators from '../../actions'
import {getBookmarkInfo} from '../utils/getters'
import {openBookmarkTree} from './openBookmarkTree'

export const bookmarkTreesSelector = R.path(['bookmark', 'trees'])

export function* arrowRightNavigate({
  payload
}: ActionType<typeof bookmarkCreators.arrowRightNavigate>): SagaIterator {
  const bookmarkInfo = yield call(getBookmarkInfo, payload.id)
  if (bookmarkInfo.type === CST.BOOKMARK_TYPES.FOLDER) {
    yield call(openBookmarkTree, bookmarkCreators.openBookmarkTree(payload.id, payload.parentId))

    // make sure run after `openBookmarkTree`
    const trees = yield select(bookmarkTreesSelector)
    const lastTree = trees[trees.length - 1]
    if (lastTree && lastTree.children.length) {
      yield put(bookmarkCreators.setFocusId(lastTree.children[0].id))
    }
  }
}
