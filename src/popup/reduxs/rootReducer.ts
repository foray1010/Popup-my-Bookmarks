import { combineReducers } from 'redux'
import type { StateType } from 'typesafe-actions'

import { bookmarkReducer } from './bookmark/reducer'
import { editorReducer } from './editor/reducer'
import { lastPositionsReducer } from './lastPositions/reducer'
import { menuReducer } from './menu/reducer'
import { optionsReducer } from './options/reducer'
import { uiReducer } from './ui/reducer'

export const rootReducer = combineReducers({
  bookmark: bookmarkReducer,
  editor: editorReducer,
  lastPositions: lastPositionsReducer,
  menu: menuReducer,
  options: optionsReducer,
  ui: uiReducer,
})

export type RootState = StateType<typeof rootReducer>
