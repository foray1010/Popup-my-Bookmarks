// @flow strict

import * as R from 'ramda'
import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import * as CST from '../../../../constants'
import {bookmarkCreators} from '../../actions'
import {getBookmarkInfo} from '../utils/getters'
import {openBookmarkTree} from './openBookmarkTree'

export const bookmarkTreesSelector = R.path(['bookmark', 'trees'])

export function* arrowRightNavigate({
  payload
}: ActionType<typeof bookmarkCreators.arrowRightNavigate>): Saga<void> {
  const bookmarkInfo = yield call(getBookmarkInfo, payload.id)
  if (bookmarkInfo.type === CST.TYPE_FOLDER) {
    yield call(openBookmarkTree, bookmarkCreators.openBookmarkTree(payload.id, payload.parentId))

    // make sure run after `openBookmarkTree`
    const trees = yield select(bookmarkTreesSelector)
    const lastTree = trees[trees.length - 1]
    if (lastTree && lastTree.children.length) {
      yield put(bookmarkCreators.setFocusId(lastTree.children[0].id))
    }
  }
}
