import {SagaIterator} from 'redux-saga'
import {all, call, put, select} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {BookmarkInfo} from '../../../../types'
import {getBookmarkInfo} from '../../../bookmark/saga/utils/getters'
import {RootState} from '../../../rootReducer'
import * as menuCreators from '../../actions'
import {getMenuPattern} from '../utils/getMenuPattern'

export function* openMenu({payload}: ActionType<typeof menuCreators.openMenu>): SagaIterator {
  try {
    const [isSearching, bookmarkInfo]: [boolean, BookmarkInfo] = yield all([
      select((state: RootState) => Boolean(state.bookmark.searchKeyword)),
      call(getBookmarkInfo, payload.targetId)
    ])

    const menuPattern = getMenuPattern(bookmarkInfo, isSearching)
    yield put(menuCreators.setMenuPattern(menuPattern))
  } catch (err) {
    console.error(err)
  }
}
