import {ActionType, createReducer, getType} from 'typesafe-actions'

import {MenuPattern} from '../../types'
import * as menuCreators from './actions'

interface MenuState {
  menuPattern: MenuPattern
  positionLeft: number
  positionTop: number
  targetId?: string
}
const INITIAL_STATE: MenuState = {
  menuPattern: [],
  positionLeft: 0,
  positionTop: 0,
  targetId: undefined
}

export const menuReducer = createReducer<MenuState, ActionType<typeof menuCreators>>(
  INITIAL_STATE,
  {
    [getType(menuCreators.closeMenu)]: () => INITIAL_STATE,
    [getType(menuCreators.openMenu)]: (
      state: MenuState,
      {payload}: ReturnType<typeof menuCreators.openMenu>
    ) => {
      return {
        ...state,
        ...payload.coordinates,
        targetId: payload.targetId
      }
    },
    [getType(menuCreators.setMenuPattern)]: (
      state: MenuState,
      {payload}: ReturnType<typeof menuCreators.setMenuPattern>
    ) => {
      return {
        ...state,
        menuPattern: payload.menuPattern
      }
    }
  }
)
