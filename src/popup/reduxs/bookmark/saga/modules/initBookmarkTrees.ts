import * as R from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { getLocalStorage } from '../../../../../core/utils'
import { OPTIONS } from '../../../../constants'
import type { BookmarkTree } from '../../../../types'
import type { RootState } from '../../../rootReducer'
import * as bookmarkCreators from '../../actions'
import { getBookmarkTrees } from '../utils/getters'

export function* initBookmarkTrees() {
  try {
    const { options }: RootState = yield select(R.identity)

    const { lastPositions = [] } = yield call(getLocalStorage)

    const [, ...openedTreeIds] = options[OPTIONS.REMEMBER_POS]
      ? lastPositions.map((x: any) => x.id)
      : []

    const bookmarkTrees: Array<BookmarkTree> = yield call(
      getBookmarkTrees,
      openedTreeIds,
      options,
    )

    yield put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
  } catch (err) {
    console.error(err)
  }
}
