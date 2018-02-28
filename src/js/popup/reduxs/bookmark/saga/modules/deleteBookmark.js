// @flow

import type {Saga} from 'redux-saga'
import {call} from 'redux-saga/effects'

import {removeBookmark, removeBookmarkTree} from '../../../../../common/functions'
import * as CST from '../../../../constants'
import {getBookmarkInfo} from '../utils/getters'

type Payload = {|
  id: string
|}
export function* deleteBookmark({id}: Payload): Saga<void> {
  try {
    const bookmarkInfo = yield call(getBookmarkInfo, id)

    if (bookmarkInfo.type === CST.TYPE_FOLDER) {
      yield call(removeBookmarkTree, id)
    } else {
      yield call(removeBookmark, id)
    }
  } catch (err) {
    console.error(err)
  }
}
