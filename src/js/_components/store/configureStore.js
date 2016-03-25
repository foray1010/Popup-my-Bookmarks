import {batchedSubscribe} from 'redux-batched-subscribe'
import {createStore, applyMiddleware} from 'redux'
import multi from 'redux-multi'

const middlewares = [
  multi
]

if (process.env.NODE_ENV === 'development') {
  const createLogger = require('redux-logger')
  middlewares.push(createLogger()) // must be the last item
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)

const createStoreWithBatching = batchedSubscribe((fn) => fn())(createStoreWithMiddleware)

export default createStoreWithBatching
