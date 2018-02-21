// @flow

import * as R from 'ramda'
import {applyMiddleware, createStore} from 'redux'
import type {CombinedReducer} from 'redux'
import createSagaMiddleware from 'redux-saga'
import type {Saga} from 'redux-saga'
import {composeWithDevTools} from 'remote-redux-devtools'

const composeEnhancers =
  process.env.NODE_ENV === 'development' ? composeWithDevTools({port: 8000}) : R.compose

type Payload = {
  rootReducer: CombinedReducer<*, *>,
  rootSaga: Saga<void>,
  preloadedState?: Object
};
export default ({rootReducer, rootSaga, preloadedState}: Payload) => {
  const sagaMiddleware = createSagaMiddleware()

  const createStoreWithFilteredArgs = R.compose(R.apply(createStore), R.reject(R.isNil))
  const store = createStoreWithFilteredArgs([
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  ])

  sagaMiddleware.run(rootSaga)

  return store
}
