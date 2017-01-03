/* @flow */
/* eslint global-require: 0 */ // webpack cannot drop unused dependencies

import {applyMiddleware, compose, createStore} from 'redux'
import {batchedSubscribe} from 'redux-batched-subscribe'
import {unstable_batchedUpdates as batchedUpdates} from 'react-dom'
import multi from 'redux-multi'
import thunk from 'redux-thunk'

const middlewares: Function[] = [
  multi,
  thunk
]

if (process.env.NODE_ENV === 'development') {
  const createLogger: Function = require('redux-logger')

  middlewares.push(createLogger()) // must be the last item
}

export default compose(
  applyMiddleware(...middlewares),
  batchedSubscribe(batchedUpdates)
)(createStore)
