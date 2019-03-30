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
    const handleRowRightClick = (bookmarkId: string, evt: MouseEvent) => {
      if (!(evt.currentTarget instanceof HTMLElement)) return

      const targetOffset = evt.currentTarget.getBoundingClientRect()
      openMenu(bookmarkId, {
        positionLeft: evt.clientX,
        positionTop: evt.clientY,
        targetLeft: targetOffset.left,
        targetTop: targetOffset.top
      })
    }

    return {
      handleRowAuxClick: (bookmarkId: string) => (evt: MouseEvent) => {
        if (evt.button === 1) {
          handleRowMiddleClick(bookmarkId)
        }

        if (evt.button === 2) {
          handleRowRightClick(bookmarkId, evt)
        }
      },
      handleRowClick: (bookmarkId: string) => () => {
        handleRowLeftClick(bookmarkId)
      }
    }
  }, [openBookmarksInBrowser, openMenu])
}
