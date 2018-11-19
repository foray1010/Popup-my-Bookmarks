// @flow strict

import {applyMiddleware, createStore} from 'redux'
import type {Reducer, Store} from 'redux'
import createSagaMiddleware from 'redux-saga'
import type {Saga} from 'redux-saga'

export default <S, A>({
  preloadedState,
  rootReducer,
  rootSaga
}: {|
  preloadedState?: S,
  rootReducer: Reducer<S, A>,
  rootSaga: () => Saga<void>
|}): Store<S, A> => {
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(rootReducer, preloadedState, applyMiddleware(sagaMiddleware))

  sagaMiddleware.run(rootSaga)

  return store
}
