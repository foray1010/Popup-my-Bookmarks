import * as React from 'react'

import * as CST from '../../constants'
import {bookmarkCreators, menuCreators} from '../../reduxs'

export default ({
  openBookmarksInBrowser,
  openMenu
}: {
  openBookmarksInBrowser: typeof bookmarkCreators.openBookmarksInBrowser
  openMenu: typeof menuCreators.openMenu
}) => {
  return React.useMemo(() => {
    const handleRowLeftClick = (bookmarkId: string) => {
      openBookmarksInBrowser([bookmarkId], CST.OPEN_IN_TYPES.CURRENT_TAB, true)
    }
    const handleRowMiddleClick = (bookmarkId: string) => {
      openBookmarksInBrowser([bookmarkId], CST.OPEN_IN_TYPES.NEW_TAB, true)
    }
    const handleRowRightClick = (bookmarkId: string, evt: React.MouseEvent | MouseEvent) => {
      if (!(evt.currentTarget instanceof HTMLElement)) return

      const targetOffset = evt.currentTarget.getBoundingClientRect()
      openMenu(bookmarkId, {
        positionLeft: evt.clientX,
        positionTop: evt.clientY,
        targetLeft: targetOffset.left,
        targetTop: targetOffset.top
      })
    }

    // to support `chrome < 55` as auxclick is not available
    const handleRowAllClick = (bookmarkId: string, evt: React.MouseEvent | MouseEvent) => {
      switch (evt.button) {
        case 0:
          handleRowLeftClick(bookmarkId)
          break
        case 1:
          handleRowMiddleClick(bookmarkId)
          break
        case 2:
          handleRowRightClick(bookmarkId, evt)
          break
        default:
      }
    }

    return {
      handleRowAuxClick: (bookmarkId: string) => (evt: MouseEvent) => {
        handleRowAllClick(bookmarkId, evt)
      },
      handleRowClick: (bookmarkId: string) => (evt: React.MouseEvent<HTMLElement>) => {
        handleRowAllClick(bookmarkId, evt)
      }
    }
  }, [openBookmarksInBrowser, openMenu])
}
