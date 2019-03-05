import {createAction} from 'typesafe-actions'

import {MenuPattern} from '../../types'

export const clickMenuRow = createAction('CLICK_MENU_ROW', (action) => (rowName: string) =>
  action({rowName}))

export const closeMenu = createAction('CLOSE_MENU')

export const openMenu = createAction(
  'OPEN_MENU',
  (action) => (
    targetId: string,
    coordinates: {
      positionLeft: number
      positionTop: number
      targetLeft: number
      targetTop: number
    }
  ) => action({targetId, coordinates})
)

export const removeFocusedRow = createAction('REMOVE_FOCUSED_ROW')

export const setFocusedRow = createAction('SET_FOCUSED_ROW', (action) => (focusedRow: string) =>
  action({
    focusedRow
  }))

export const setMenuPattern = createAction(
  'SET_MENU_PATTERN',
  (action) => (menuPattern: MenuPattern) =>
    action({
      menuPattern
    })
)
