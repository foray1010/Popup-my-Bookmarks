import * as React from 'react'
import {useSelector} from 'react-redux'

import useAction from '../../../common/hooks/useAction'
import {BOOKMARK_TYPES, OPEN_IN_TYPES, OPTIONS} from '../../constants'
import {RootState, bookmarkCreators, menuCreators} from '../../reduxs'
import {BookmarkInfo, BookmarkTree} from '../../types'

const mapOptionToOpenBookmarkProps = (
  option?: number
): {
  openIn: OPEN_IN_TYPES
  isCloseThisExtension: boolean
} => {
  switch (option) {
    case 0: // current tab
    case 1: // current tab (without closing PmB)
      return {
        openIn: OPEN_IN_TYPES.CURRENT_TAB,
        isCloseThisExtension: option === 0
      }

    default:
    case 2: // new tab
      return {
        openIn: OPEN_IN_TYPES.NEW_TAB,
        isCloseThisExtension: true
      }

    case 3: // background tab
    case 4: // background tab (without closing PmB)
      return {
        openIn: OPEN_IN_TYPES.BACKGROUND_TAB,
        isCloseThisExtension: option === 3
      }

    case 5: // new window
      return {
        openIn: OPEN_IN_TYPES.NEW_WINDOW,
        isCloseThisExtension: true
      }

    case 6: // incognito window
      return {
        openIn: OPEN_IN_TYPES.INCOGNITO_WINDOW,
        isCloseThisExtension: true
      }
  }
}

export default ({treeInfo}: {treeInfo: BookmarkTree}) => {
  const options = useSelector((state: RootState) => state.options)

  const openBookmarksInBrowser = useAction(bookmarkCreators.openBookmarksInBrowser)
  const openFolderInBrowser = useAction(bookmarkCreators.openFolderInBrowser)
  const openMenu = useAction(menuCreators.openMenu)
  const toggleBookmarkTree = useAction(bookmarkCreators.toggleBookmarkTree)

  return React.useMemo(() => {
    const handleRowMiddleClick = (bookmarkInfo: BookmarkInfo) => {
      if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
        openFolderInBrowser(bookmarkInfo.id, {
          openIn: OPEN_IN_TYPES.NEW_TAB,
          isAllowBookmarklet: false,
          isCloseThisExtension: true
        })
      } else {
        const openBookmarkProps = mapOptionToOpenBookmarkProps(options[OPTIONS.CLICK_BY_MIDDLE])
        openBookmarksInBrowser([bookmarkInfo.id], {
          ...openBookmarkProps,
          isAllowBookmarklet: true
        })
      }
    }
    const handleRowRightClick = (bookmarkInfo: BookmarkInfo, evt: React.MouseEvent) => {
      openMenu(bookmarkInfo.id, {
        positionLeft: evt.clientX,
        positionTop: evt.clientY
      })
    }

    return {
      handleRowAuxClick: (bookmarkInfo: BookmarkInfo) => (evt: React.MouseEvent) => {
        if (evt.button === 1) {
          handleRowMiddleClick(bookmarkInfo)
        }

        if (evt.button === 2) {
          handleRowRightClick(bookmarkInfo, evt)
        }
      },
      handleRowClick: (bookmarkInfo: BookmarkInfo) => (evt: React.MouseEvent) => {
        if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
          if (options[OPTIONS.OP_FOLDER_BY]) {
            toggleBookmarkTree(bookmarkInfo.id, treeInfo.parent.id)
          }
        } else {
          const option = (() => {
            if (evt.ctrlKey || evt.metaKey) {
              return options[OPTIONS.CLICK_BY_LEFT_CTRL]
            }

            if (evt.shiftKey) {
              return options[OPTIONS.CLICK_BY_LEFT_SHIFT]
            }

            return options[OPTIONS.CLICK_BY_LEFT]
          })()

          const openBookmarkProps = mapOptionToOpenBookmarkProps(option)
          openBookmarksInBrowser([bookmarkInfo.id], {
            ...openBookmarkProps,
            isAllowBookmarklet: true
          })
        }
      }
    }
  }, [
    openBookmarksInBrowser,
    openFolderInBrowser,
    openMenu,
    options,
    toggleBookmarkTree,
    treeInfo.parent.id
  ])
}
