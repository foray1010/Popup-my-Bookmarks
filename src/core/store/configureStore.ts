import {
  Action,
  applyMiddleware,
  createStore,
  PreloadedState,
  Reducer,
  Store,
} from 'redux'
import createSagaMiddleware, { SagaIterator } from 'redux-saga'

export default <S extends {}, A extends Action<string>>({
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
