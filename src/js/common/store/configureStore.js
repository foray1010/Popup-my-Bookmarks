import multi from 'redux-multi'
import thunk from 'redux-thunk'
import {applyMiddleware, createStore} from 'redux'

const middlewares = [multi, thunk]

export default applyMiddleware(...middlewares)(createStore)
