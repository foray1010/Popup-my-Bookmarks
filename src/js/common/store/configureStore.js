/* @flow */

import {applyMiddleware, compose, createStore} from 'redux'
import {batchedSubscribe} from 'redux-batched-subscribe'
import _debounce from 'lodash/debounce'
import multi from 'redux-multi'
import thunk from 'redux-thunk'

const middlewares: Function[] = [
  multi,
  thunk
]

export default compose(
  applyMiddleware(...middlewares),
  batchedSubscribe(_debounce((notify) => notify()))
)(createStore)
