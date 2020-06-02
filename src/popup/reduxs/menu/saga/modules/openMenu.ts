import * as R from 'ramda'
import { call, put, select } from 'redux-saga/effects'
import type { ActionType } from 'typesafe-actions'

import type { BookmarkInfo } from '../../../../types'
import { getBookmarkInfo } from '../../../bookmark/saga/utils/getters'
import type { RootState } from '../../../rootReducer'
import * as menuCreators from '../../actions'
import { getMenuPattern } from '../utils/getMenuPattern'

export function* openMenu({
  payload,
}: ActionType<typeof menuCreators.openMenu>) {
  try {
    const { bookmark }: RootState = yield select(R.identity)

    const bookmarkInfo: BookmarkInfo = yield call(
      getBookmarkInfo,
      payload.targetId,
    )
    const isSearching = Boolean(bookmark.searchKeyword)

    const menuPattern = getMenuPattern(bookmarkInfo, isSearching)
    yield put(menuCreators.setMenuPattern(menuPattern))
  } catch (err) {
    console.error(err)
  }
}
