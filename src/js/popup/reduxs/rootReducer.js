// @flow

import {combineReducers} from 'redux'

import {bookmarkReducer} from './bookmark/reducer'
import {optionsReducer} from './options/reducer'
import {uiReducer} from './ui/reducer'

export const rootReducer = combineReducers({
  bookmark: bookmarkReducer,
  options: optionsReducer,
  ui: uiReducer
})
