import * as React from 'react'

import * as CST from '../../constants'
import {bookmarkCreators, menuCreators} from '../../reduxs'
import {BookmarkInfo} from '../../types'

export default ({
  openBookmarksInBrowser,
  openFolderInBrowser,
  openMenu
}: {
  openBookmarksInBrowser: typeof bookmarkCreators.openBookmarksInBrowser
  openFolderInBrowser: typeof bookmarkCreators.openFolderInBrowser
  openMenu: typeof menuCreators.openMenu
}) => {
  return React.useMemo(() => {
    const handleRowLeftClick = (bookmarkInfo: BookmarkInfo) => {
      openBookmarksInBrowser([bookmarkInfo.id], CST.OPEN_IN_TYPES.CURRENT_TAB, true)
    }
    const handleRowMiddleClick = (bookmarkInfo: BookmarkInfo) => {
      if (bookmarkInfo.type === CST.BOOKMARK_TYPES.FOLDER) {
        openFolderInBrowser(bookmarkInfo.id, CST.OPEN_IN_TYPES.NEW_TAB, true)
      } else {
        openBookmarksInBrowser([bookmarkInfo.id], CST.OPEN_IN_TYPES.NEW_TAB, true)
      }
    }
    const handleRowRightClick = (
      bookmarkInfo: BookmarkInfo,
      evt: React.MouseEvent<HTMLElement>
    ) => {
      if (!(evt.currentTarget instanceof HTMLElement)) return

      const targetOffset = evt.currentTarget.getBoundingClientRect()
      openMenu(bookmarkInfo.id, {
        positionLeft: evt.clientX,
        positionTop: evt.clientY,
        targetLeft: targetOffset.left,
        targetTop: targetOffset.top
      })
    }

    return {
      handleRowAuxClick: (bookmarkInfo: BookmarkInfo) => (evt: React.MouseEvent<HTMLElement>) => {
        if (evt.button === 1) {
          handleRowMiddleClick(bookmarkInfo)
        }

        if (evt.button === 2) {
          handleRowRightClick(bookmarkInfo, evt)
        }
      },
      handleRowClick: (bookmarkInfo: BookmarkInfo) => () => {
        handleRowLeftClick(bookmarkInfo)
      }
    }
  }, [openBookmarksInBrowser, openFolderInBrowser, openMenu])
}
