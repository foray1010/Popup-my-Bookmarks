// @flow strict

import type {Saga} from 'redux-saga'
import {all, call, put, select} from 'redux-saga/effects'

import {getBookmarkInfo} from '../../../bookmark/saga/utils/getters'
import {uiCreators} from '../../../ui/actions'
import {menuCreators} from '../../actions'
import {getMenuPattern} from '../utils/getMenuPattern'

type Payload = {|
  targetId: string
|}
export function* openMenu({targetId}: Payload): Saga<void> {
  const [isSearching, bookmarkInfo] = yield all([
    select((state) => Boolean(state.bookmark.searchKeyword)),
    call(getBookmarkInfo, targetId)
  ])

  const menuPattern = getMenuPattern(bookmarkInfo, isSearching)
  yield put(menuCreators.setMenuPattern(menuPattern))
  yield put(uiCreators.setIsDisableGlobalKeyboardEvent(true))
}
