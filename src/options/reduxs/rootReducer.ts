import {combineReducers} from 'redux'
import {StateType} from 'typesafe-actions'

import {navigationReducer} from './navigation/reducer'
import {optionsReducer} from './options/reducer'

export const rootReducer = combineReducers({
  navigation: navigationReducer,
  options: optionsReducer
})

export type RootState = StateType<typeof rootReducer>
