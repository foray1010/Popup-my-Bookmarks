import {SagaIterator} from 'redux-saga'
import {all, call, put, select} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {getBookmarkInfo} from '../../../bookmark/saga/utils/getters'
import {RootState} from '../../../rootReducer'
import * as menuCreators from '../../actions'
import {getMenuPattern} from '../utils/getMenuPattern'

export function* openMenu({payload}: ActionType<typeof menuCreators.openMenu>): SagaIterator {
  const [isSearching, bookmarkInfo] = yield all([
    select((state: RootState) => Boolean(state.bookmark.searchKeyword)),
    call(getBookmarkInfo, payload.targetId)
  ])

  const menuPattern = getMenuPattern(bookmarkInfo, isSearching)
  yield put(menuCreators.setMenuPattern(menuPattern))
}
