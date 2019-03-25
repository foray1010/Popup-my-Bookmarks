import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import {RootState} from '../../../rootReducer'
import * as bookmarkCreators from '../../actions'
import {getBookmarkTrees} from '../utils/getters'

export const getRememberedTreeIds = ({
  lastPositions,
  options
}: {
  lastPositions: RootState['lastPositions']
  options: RootState['options']
}): Array<string> => {
  if (!options.rememberPos) return []
  return (lastPositions || []).map((x) => x.id)
}

export function* initBookmarkTrees(): SagaIterator {
  const {lastPositions, options}: RootState = yield select(R.identity)

  const rememberedTreeIds = getRememberedTreeIds({lastPositions, options})

  const bookmarkTrees = yield call(getBookmarkTrees, R.tail(rememberedTreeIds), options)

  yield put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
}
