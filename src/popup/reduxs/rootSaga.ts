import { fork } from 'redux-saga/effects'

import { bookmarkSaga } from './bookmark/saga'

export function* rootSaga() {
  try {
    yield fork(bookmarkSaga)
  } catch (err: unknown) {
    console.error(err)
  }
}
