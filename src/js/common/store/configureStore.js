// @flow strict

import * as R from 'ramda'
import {applyMiddleware, createStore} from 'redux'
import type {CombinedReducer} from 'redux'
import createSagaMiddleware from 'redux-saga'
import type {Saga} from 'redux-saga'

type Payload = {|
  preloadedState?: Object,
  rootReducer: CombinedReducer<any, any>,
  rootSaga: () => Saga<void>
|}
export default ({rootReducer, rootSaga, preloadedState}: Payload) => {
  const sagaMiddleware = createSagaMiddleware()

  const createStoreWithFilteredArgs = R.compose(R.apply(createStore), R.reject(R.isNil))
  const store = createStoreWithFilteredArgs([
    rootReducer,
    preloadedState,
    applyMiddleware(sagaMiddleware)
  ])

  sagaMiddleware.run(rootSaga)

  return store
}
