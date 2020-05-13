import * as React from 'react'

import { CLICK_OPTIONS, OPEN_IN_TYPES, OPTIONS } from '../constants'

export const getClickOptionNameByEvent = (
  evt: KeyboardEvent | MouseEvent | React.KeyboardEvent | React.MouseEvent,
) => {
  if (evt.ctrlKey || evt.metaKey) {
    return OPTIONS.CLICK_BY_LEFT_CTRL
  }

  if (evt.shiftKey) {
    return OPTIONS.CLICK_BY_LEFT_SHIFT
  }

  return OPTIONS.CLICK_BY_LEFT
}

export const mapOptionToOpenBookmarkProps = (
  option?: string,
): {
  openIn: OPEN_IN_TYPES
  isCloseThisExtension: boolean
} => {
  switch (option) {
    default:
    case CLICK_OPTIONS.CURRENT_TAB:
    case CLICK_OPTIONS.CURRENT_TAB_WITHOUT_CLOSING_PMB:
      return {
        openIn: OPEN_IN_TYPES.CURRENT_TAB,
        isCloseThisExtension:
          option !== CLICK_OPTIONS.CURRENT_TAB_WITHOUT_CLOSING_PMB,
      }

    case CLICK_OPTIONS.NEW_TAB:
      return {
        openIn: OPEN_IN_TYPES.NEW_TAB,
        isCloseThisExtension: true,
      }

    case CLICK_OPTIONS.BACKGROUND_TAB:
    case CLICK_OPTIONS.BACKGROUND_TAB_WITHOUT_CLOSING_PMB:
      return {
        openIn: OPEN_IN_TYPES.BACKGROUND_TAB,
        isCloseThisExtension:
          option !== CLICK_OPTIONS.BACKGROUND_TAB_WITHOUT_CLOSING_PMB,
      }

    case CLICK_OPTIONS.NEW_WINDOW:
      return {
        openIn: OPEN_IN_TYPES.NEW_WINDOW,
        isCloseThisExtension: true,
      }

    case CLICK_OPTIONS.INCOGNITO_WINDOW:
      return {
        openIn: OPEN_IN_TYPES.INCOGNITO_WINDOW,
        isCloseThisExtension: true,
      }
  }
}
