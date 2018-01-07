import createSagaMiddleware from 'redux-saga'
import multi from 'redux-multi'
import R from 'ramda'
import thunk from 'redux-thunk'
import {applyMiddleware, createStore} from 'redux'

export default ({reducers, sagas, preloadedState}) => {
  const sagaMiddleware = createSagaMiddleware()

  const createStoreWithFilteredArgs = R.compose(R.apply(createStore), R.reject(R.isNil))
  const store = createStoreWithFilteredArgs([
    reducers,
    preloadedState,
    applyMiddleware(multi, thunk, sagaMiddleware)
  ])

  if (sagas) sagaMiddleware.run(sagas)

  return store
}
