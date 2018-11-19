// @flow strict

import {combineReducers} from 'redux'

import {navigationReducer} from './navigation/reducer'
import {optionsReducer} from './options/reducer'

export const rootReducer = combineReducers({
  navigation: navigationReducer,
  options: optionsReducer
})

type ExtractReturnType = <R>(() => R) => R
export type RootState = $Call<ExtractReturnType, typeof rootReducer>
