import * as R from 'ramda'
import {applyMiddleware, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {composeWithDevTools} from 'remote-redux-devtools'

const composeEnhancers =
  process.env.NODE_ENV === 'development' ? composeWithDevTools({port: 8000}) : R.compose

export default ({rootReducer, rootSaga, preloadedState}) => {
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
