// @flow strict

import {handleActions} from 'redux-actions'
import type {ActionType} from 'redux-actions'

import type {MenuPattern} from '../../types'
import {menuCreators, menuTypes} from './actions'

type State = {|
  focusedRow: string,
  menuPattern: MenuPattern,
  positionLeft: number,
  positionTop: number,
  targetId: string,
  targetLeft: number,
  targetTop: number
|}
const INITIAL_STATE: State = {
  focusedRow: '',
  menuPattern: [],
  positionLeft: 0,
  positionTop: 0,
  targetId: '',
  targetLeft: 0,
  targetTop: 0
}

const closeMenu = (): State => INITIAL_STATE

const openMenu = (state: State, {payload}: ActionType<typeof menuCreators.openMenu>): State => ({
  ...state,
  ...payload.coordinates,
  targetId: payload.targetId
})

const removeFocusedRow = (state: State): State => ({
  ...state,
  focusedRow: ''
})

const setFocusedRow = (
  state: State,
  {payload}: ActionType<typeof menuCreators.setFocusedRow>
): State => ({
  ...state,
  focusedRow: payload.focusedRow
})

const setMenuPattern = (
  state: State,
  {payload}: ActionType<typeof menuCreators.setMenuPattern>
): State => ({
  ...state,
  menuPattern: payload.menuPattern
})

export const menuReducer = handleActions(
  {
    [menuTypes.CLOSE_MENU]: closeMenu,
    [menuTypes.OPEN_MENU]: openMenu,
    [menuTypes.REMOVE_FOCUSED_ROW]: removeFocusedRow,
    [menuTypes.SET_FOCUSED_ROW]: setFocusedRow,
    [menuTypes.SET_MENU_PATTERN]: setMenuPattern
  },
  INITIAL_STATE
)
