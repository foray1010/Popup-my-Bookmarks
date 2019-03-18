import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import {RootState} from '../../../rootReducer'
import * as bookmarkCreators from '../../actions'
import {getBookmarkTrees} from '../utils/getters'

export const getRememberedTreeIds = ({
  localStorage,
  options
}: {
  localStorage: RootState['localStorage']
  options: RootState['options']
}): Array<string> => {
  if (!options.rememberPos) return []
  return (localStorage.lastPositions || []).map((x) => x.id)
}

export function* initBookmarkTrees(): SagaIterator {
  const {localStorage, options}: RootState = yield select(R.identity)

  const rememberedTreeIds = getRememberedTreeIds({localStorage, options})

  const bookmarkTrees = yield call(getBookmarkTrees, R.tail(rememberedTreeIds), options)

  yield put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
}
