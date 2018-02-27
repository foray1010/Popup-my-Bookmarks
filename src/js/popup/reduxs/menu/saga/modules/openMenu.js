// @flow

import type {Saga} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import {getBookmarkInfo} from '../../../bookmark/saga/utils/getters'
import {menuCreators} from '../../actions'
import {getMenuPattern} from '../utils/getMenuPattern'

type Payload = {|
  targetId: string
|}
export function* openMenu({targetId}: Payload): Saga<void> {
  try {
    const isSearching = yield select((state) => Boolean(state.bookmark.searchKeyword))

    const bookmarkInfo = yield call(getBookmarkInfo, targetId)

    const menuPattern = getMenuPattern(bookmarkInfo, isSearching)
    yield put(menuCreators.setMenuPattern(menuPattern))
  } catch (err) {
    console.error(err)
  }
}
