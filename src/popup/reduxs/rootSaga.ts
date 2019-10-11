import { all, fork } from 'redux-saga/effects'

import { bookmarkSaga } from './bookmark/saga'
import { editorSaga } from './editor/saga'
import { lastPositionsSaga } from './lastPositions/saga'
import { menuSaga } from './menu/saga'

export function* rootSaga() {
  try {
    yield all([bookmarkSaga, editorSaga, lastPositionsSaga, menuSaga].map(fork))
  } catch (err) {
    console.error(err)
  }
}
