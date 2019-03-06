import {ActionType, getType} from 'typesafe-actions'

import {MenuPattern} from '../../types'
import * as menuCreators from './actions'

interface MenuState {
  focusedRow: string
  menuPattern: MenuPattern
  positionLeft: number
  positionTop: number
  targetId: string
  targetLeft: number
  targetTop: number
}
const INITIAL_STATE: MenuState = {
  focusedRow: '',
  menuPattern: [],
  positionLeft: 0,
  positionTop: 0,
  targetId: '',
  targetLeft: 0,
  targetTop: 0
}

export const menuReducer = (
  state: MenuState = INITIAL_STATE,
  action: ActionType<typeof menuCreators>
): MenuState => {
  switch (action.type) {
    case getType(menuCreators.closeMenu):
      return INITIAL_STATE

    case getType(menuCreators.openMenu):
      return {
        ...state,
        ...action.payload.coordinates,
        targetId: action.payload.targetId
      }

    case getType(menuCreators.removeFocusedRow):
      return {
        ...state,
        focusedRow: ''
      }

    case getType(menuCreators.setFocusedRow):
      return {
        ...state,
        focusedRow: action.payload.focusedRow
      }

    case getType(menuCreators.setMenuPattern):
      return {
        ...state,
        menuPattern: action.payload.menuPattern
      }

    default:
      return state
  }
}
