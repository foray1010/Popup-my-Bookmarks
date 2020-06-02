import * as R from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { OPTIONS } from '../../../../constants'
import type { BookmarkTree } from '../../../../types'
import type { RootState } from '../../../rootReducer'
import * as bookmarkCreators from '../../actions'
import { getBookmarkTrees } from '../utils/getters'

export const getRememberedTreeIds = ({
  lastPositions,
  options,
}: {
  lastPositions: RootState['lastPositions']
  options: RootState['options']
}): Array<string> => {
  if (!options[OPTIONS.REMEMBER_POS]) return []
  return (lastPositions ?? []).map((x) => x.id)
}

export function* initBookmarkTrees() {
  try {
    const { lastPositions, options }: RootState = yield select(R.identity)

    const [, ...openedTreeIds] = getRememberedTreeIds({
      lastPositions,
      options,
    })

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
