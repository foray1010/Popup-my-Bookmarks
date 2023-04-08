import type * as React from 'react'

import { OPEN_IN_TYPES, OPTIONS } from '../../../constants/index.js'

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
  option: number,
): {
  readonly openIn: OPEN_IN_TYPES
  readonly isCloseThisExtension: boolean
} => {
  switch (option) {
    case 0: // current tab
    case 1: // current tab (without closing PmB)
      return {
        openIn: OPEN_IN_TYPES.CURRENT_TAB,
        isCloseThisExtension: option === 0,
      }

    default:
    case 2: // new tab
      return {
        openIn: OPEN_IN_TYPES.NEW_TAB,
        isCloseThisExtension: true,
      }

    case 3: // background tab
    case 4: // background tab (without closing PmB)
      return {
        openIn: OPEN_IN_TYPES.BACKGROUND_TAB,
        isCloseThisExtension: option === 3,
      }

    case 5: // new window
      return {
        openIn: OPEN_IN_TYPES.NEW_WINDOW,
        isCloseThisExtension: true,
      }

    case 6: // incognito window
      return {
        openIn: OPEN_IN_TYPES.INCOGNITO_WINDOW,
        isCloseThisExtension: true,
      }
  }
}
