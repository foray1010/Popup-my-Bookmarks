// @flow

import {combineReducers} from 'redux'

import {navigationReducer} from './navigation/reducer'
import {optionsReducer} from './options/reducer'

export const rootReducer = combineReducers({
  navigation: navigationReducer,
  options: optionsReducer
})
