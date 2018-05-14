// @flow strict

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import * as CST from '../../../../constants'
import {bookmarkCreators} from '../../actions'
import {getBookmarkInfo} from '../utils/getters'
import {openBookmarkTree} from './openBookmarkTree'

export const bookmarkTreesSelector = R.path(['bookmark', 'trees'])

type Payload = {|
  id: string,
  // not necessary to be `parentId` of `id`, such as root folders
  parentId: string
|}
export function* arrowRightNavigate({id, parentId}: Payload): Saga<void> {
  const bookmarkInfo = yield call(getBookmarkInfo, id)
  if (bookmarkInfo.type === CST.TYPE_FOLDER) {
    yield call(openBookmarkTree, {id, parentId})

    const trees = yield select(bookmarkTreesSelector)
    const lastTree = trees[trees.length - 1]
    if (lastTree && lastTree.children.length) {
      yield put(bookmarkCreators.setFocusId(lastTree.children[0].id))
    }
  }
}
