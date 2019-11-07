import { createAction } from 'typesafe-actions'

import { MenuPattern } from '../../types'

export const clickMenuRow = createAction(
  'CLICK_MENU_ROW',
  (rowName: string) => ({ rowName }),
)()

export const closeMenu = createAction('CLOSE_MENU')()

export const openMenu = createAction(
  'OPEN_MENU',
  (
    targetId: string,
    coordinates: {
      positionLeft: number
      positionTop: number
    },
  ) => ({ targetId, coordinates }),
)()

export const setMenuPattern = createAction(
  'SET_MENU_PATTERN',
  (menuPattern: MenuPattern) => ({
    menuPattern,
  }),
)()
