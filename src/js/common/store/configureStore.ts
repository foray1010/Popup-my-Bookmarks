import {Reducer, Store, applyMiddleware, createStore} from 'redux'
import createSagaMiddleware, {SagaIterator} from 'redux-saga'

export default <S>({
  preloadedState,
  rootReducer,
  rootSaga
}: {
  preloadedState?: S
  rootReducer: Reducer<S>
  rootSaga: () => SagaIterator
}): Store<S> => {
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(rootReducer, preloadedState, applyMiddleware(sagaMiddleware))

  sagaMiddleware.run(rootSaga)

  return store
}
