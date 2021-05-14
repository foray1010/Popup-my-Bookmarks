import type {
  Action,
  CombinedState,
  PreloadedState,
  Reducer,
  Store,
} from 'redux'
import { applyMiddleware, createStore } from 'redux'
import type { SagaIterator } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'

export default function configureStore<
  S extends Record<string, unknown>,
  A extends Action<string>,
>({
  preloadedState,
  rootReducer,
  rootSaga,
}: {
  preloadedState?: PreloadedState<CombinedState<S>>
  rootReducer: Reducer<CombinedState<S>, A>
  rootSaga(): SagaIterator
}): Store<CombinedState<S>, A> {
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(sagaMiddleware),
  )

  sagaMiddleware.run(rootSaga)

  return store
}
