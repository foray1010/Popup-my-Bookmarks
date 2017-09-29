// @flow

import debounce from 'lodash.debounce'
import multi from 'redux-multi'
import thunk from 'redux-thunk'
import {applyMiddleware, compose, createStore} from 'redux'
import {batchedSubscribe} from 'redux-batched-subscribe'

const middlewares: Function[] = [multi, thunk]

export default compose(
  applyMiddleware(...middlewares),
  batchedSubscribe(debounce((notify) => notify()))
)(createStore)
