import {createAction} from 'typesafe-actions'

import {MenuPattern} from '../../types'

export const clickMenuRow = createAction('CLICK_MENU_ROW', action => (rowName: string) =>
  action({rowName})
)

export const closeMenu = createAction('CLOSE_MENU')

export const openMenu = createAction(
  'OPEN_MENU',
  action => (
    targetId: string,
    coordinates: {
      positionLeft: number
      positionTop: number
    }
  ) => action({targetId, coordinates})
)

export const setMenuPattern = createAction(
  'SET_MENU_PATTERN',
  action => (menuPattern: MenuPattern) =>
    action({
      menuPattern
    })
)
