// @flow strict

import {applyMiddleware, createStore} from 'redux'
import type {CombinedReducer} from 'redux'
import createSagaMiddleware from 'redux-saga'
import type {Saga} from 'redux-saga'

type Payload = {|
  preloadedState?: Object,
  rootReducer: CombinedReducer<any, any>,
  rootSaga: () => Saga<void>
|}
export default ({rootReducer, rootSaga, preloadedState = {}}: Payload) => {
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(rootReducer, preloadedState, applyMiddleware(sagaMiddleware))

  sagaMiddleware.run(rootSaga)

  return store
}
