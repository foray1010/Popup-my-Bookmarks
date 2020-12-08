import { combineReducers } from 'redux'
import type { StateType } from 'typesafe-actions'

import { bookmarkReducer } from './bookmark/reducer'
import { optionsReducer } from './options/reducer'

export const rootReducer = combineReducers({
  bookmark: bookmarkReducer,
  options: optionsReducer,
})

export type RootState = StateType<typeof rootReducer>
