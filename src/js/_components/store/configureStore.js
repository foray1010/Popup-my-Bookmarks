import {applyMiddleware, compose, createStore} from 'redux'
import {batchedSubscribe} from 'redux-batched-subscribe'
import multi from 'redux-multi'
import ReactDOM from 'react-dom'

import debounceByAnimationFrame from '../lib/debounceByAnimationFrame'

const middlewares = [
  multi
]

if (process.env.NODE_ENV === 'development') {
  const createLogger = require('redux-logger')
  middlewares.push(createLogger()) // must be the last item
}

export default compose(
  applyMiddleware(...middlewares),
  batchedSubscribe(debounceByAnimationFrame(ReactDOM.unstable_batchedUpdates))
)(createStore)
