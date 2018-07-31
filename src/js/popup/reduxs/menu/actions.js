// @flow strict

import {createAction} from 'redux-actions'

import type {MenuPattern} from '../../types'

export const menuTypes = {
  CLICK_MENU_ROW: 'CLICK_MENU_ROW',
  CLOSE_MENU: 'CLOSE_MENU',
  OPEN_MENU: 'OPEN_MENU',
  REMOVE_FOCUSED_ROW: 'REMOVE_FOCUSED_ROW',
  SET_FOCUSED_ROW: 'SET_FOCUSED_ROW',
  SET_MENU_PATTERN: 'SET_MENU_PATTERN'
}

const clickMenuRow = createAction(menuTypes.CLICK_MENU_ROW, (rowName: string) => ({rowName}))

const closeMenu = createAction(menuTypes.CLOSE_MENU)

const openMenu = createAction(
  menuTypes.OPEN_MENU,
  (
    targetId: string,
    coordinates: {|
      positionLeft: number,
      positionTop: number,
      targetLeft: number,
      targetTop: number
    |}
  ) => ({targetId, coordinates})
)

const removeFocusedRow = createAction(menuTypes.REMOVE_FOCUSED_ROW)

const setFocusedRow = createAction(menuTypes.SET_FOCUSED_ROW, (focusedRow: string) => ({
  focusedRow
}))

const setMenuPattern = createAction(menuTypes.SET_MENU_PATTERN, (menuPattern: MenuPattern) => ({
  menuPattern
}))

export const menuCreators = {
  clickMenuRow,
  closeMenu,
  openMenu,
  removeFocusedRow,
  setFocusedRow,
  setMenuPattern
}
