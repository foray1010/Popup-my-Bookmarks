import R from 'ramda'
import {applyMiddleware, createStore} from 'redux'
import multi from 'redux-multi'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'

export default ({rootReducer, rootSaga, preloadedState}) => {
  const sagaMiddleware = createSagaMiddleware()

  const createStoreWithFilteredArgs = R.compose(R.apply(createStore), R.reject(R.isNil))
  const store = createStoreWithFilteredArgs([
    rootReducer,
    preloadedState,
    applyMiddleware(multi, thunk, sagaMiddleware)
  ])

  if (rootSaga) sagaMiddleware.run(rootSaga)

  return store
}
