import {applyMiddleware, compose, createStore} from 'redux'
import {batchedSubscribe} from 'redux-batched-subscribe'
import _debounce from 'lodash.debounce'
import multi from 'redux-multi'

const batchDebounce = _debounce((notify) => notify())
const middlewares = [
  multi
]

if (process.env.NODE_ENV === 'development') {
  const createLogger = require('redux-logger')
  middlewares.push(createLogger()) // must be the last item
}

export default compose(
  applyMiddleware(...middlewares),
  batchedSubscribe(batchDebounce)
)(createStore)
