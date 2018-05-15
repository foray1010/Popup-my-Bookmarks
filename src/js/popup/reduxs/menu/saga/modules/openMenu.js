// @flow strict

import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {all, call, put, select} from 'redux-saga/effects'

import {getBookmarkInfo} from '../../../bookmark/saga/utils/getters'
import {uiCreators} from '../../../ui/actions'
import {menuCreators} from '../../actions'
import {getMenuPattern} from '../utils/getMenuPattern'

export function* openMenu({payload}: ActionType<typeof menuCreators.openMenu>): Saga<void> {
  const [isSearching, bookmarkInfo] = yield all([
    select((state) => Boolean(state.bookmark.searchKeyword)),
    call(getBookmarkInfo, payload.targetId)
  ])

  const menuPattern = getMenuPattern(bookmarkInfo, isSearching)
  yield put(menuCreators.setMenuPattern(menuPattern))
  yield put(uiCreators.setIsDisableGlobalKeyboardEvent(true))
}
