// @flow strict

import {combineReducers} from 'redux'

import {bookmarkReducer} from './bookmark/reducer'
import {editorReducer} from './editor/reducer'
import {menuReducer} from './menu/reducer'
import {optionsReducer} from './options/reducer'
import {uiReducer} from './ui/reducer'

export const rootReducer = combineReducers({
  bookmark: bookmarkReducer,
  editor: editorReducer,
  menu: menuReducer,
  options: optionsReducer,
  ui: uiReducer
})
