import type { Action, PreloadedState, Reducer, Store } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import type { SagaIterator } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'

export default <S extends Record<string, unknown>, A extends Action<string>>({
  preloadedState,
  rootReducer,
  rootSaga,
}: {
  preloadedState?: PreloadedState<S>
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
