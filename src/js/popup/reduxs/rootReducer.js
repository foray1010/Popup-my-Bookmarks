import {combineReducers} from 'redux'

import {bookmarkReducer} from './bookmark/reducer'
import {optionsReducer} from './options/reducer'

export const rootReducer = combineReducers({
  bookmark: bookmarkReducer,
  options: optionsReducer
})
