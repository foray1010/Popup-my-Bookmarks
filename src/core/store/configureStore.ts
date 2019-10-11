import { Action, Reducer, Store, applyMiddleware, createStore } from 'redux'
import createSagaMiddleware, { SagaIterator } from 'redux-saga'

export default <S extends {}, A extends Action<string>>({
  preloadedState,
  rootReducer,
  rootSaga,
}: {
  preloadedState?: object
  rootReducer: Reducer<S, A>
  rootSaga: () => SagaIterator
}): Store<S, A> => {
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(sagaMiddleware),
  )

  sagaMiddleware.run(rootSaga)

  return store
}
