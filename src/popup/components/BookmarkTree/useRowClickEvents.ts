import * as React from 'react'
import { useSelector } from 'react-redux'

import useAction from '../../../core/hooks/useAction'
import { BOOKMARK_TYPES, OPEN_IN_TYPES, OPTIONS } from '../../constants'
import type { RootState } from '../../reduxs'
import { bookmarkCreators } from '../../reduxs'
import type { BookmarkInfo, BookmarkTree } from '../../types'
import {
  getClickOptionNameByEvent,
  mapOptionToOpenBookmarkProps,
} from '../../utils/clickBookmarkUtils'
import { useMenuContext } from '../menu'

export default function useRowClickEvents({
  treeInfo,
}: {
  treeInfo: BookmarkTree
}) {
  const options = useSelector((state: RootState) => state.options)

  const openBookmarksInBrowser = useAction(
    bookmarkCreators.openBookmarksInBrowser,
  )
  const openFolderInBrowser = useAction(bookmarkCreators.openFolderInBrowser)
  const toggleBookmarkTree = useAction(bookmarkCreators.toggleBookmarkTree)

  const { open: openMenu } = useMenuContext()

  return React.useMemo(() => {
    const handleRowMiddleClick = (bookmarkInfo: BookmarkInfo) => {
      if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
        openFolderInBrowser(bookmarkInfo.id, {
          openIn: OPEN_IN_TYPES.NEW_TAB,
          isAllowBookmarklet: false,
          isCloseThisExtension: true,
        })
      } else {
        const openBookmarkProps = mapOptionToOpenBookmarkProps(
          options[OPTIONS.CLICK_BY_MIDDLE],
        )
        openBookmarksInBrowser([bookmarkInfo.id], {
          ...openBookmarkProps,
          isAllowBookmarklet: true,
        })
      }
    }
    const handleRowRightClick = (
      bookmarkInfo: BookmarkInfo,
      evt: React.MouseEvent,
    ) => {
      openMenu({
        targetId: bookmarkInfo.id,
        positions: {
          top: evt.clientY,
          left: evt.clientX,
        },
      })
    }

    return {
      handleRowAuxClick: (bookmarkInfo: BookmarkInfo) => (
        evt: React.MouseEvent,
      ) => {
        if (evt.button === 1) {
          handleRowMiddleClick(bookmarkInfo)
        }

        if (evt.button === 2) {
          handleRowRightClick(bookmarkInfo, evt)
        }
      },
      handleRowClick: (bookmarkInfo: BookmarkInfo) => (
        evt: React.MouseEvent,
      ) => {
        if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
          if (options[OPTIONS.OP_FOLDER_BY]) {
            toggleBookmarkTree(bookmarkInfo.id, treeInfo.parent.id)
          }
        } else {
          const option = options[getClickOptionNameByEvent(evt)]
          const openBookmarkProps = mapOptionToOpenBookmarkProps(option)
          openBookmarksInBrowser([bookmarkInfo.id], {
            ...openBookmarkProps,
            isAllowBookmarklet: true,
          })
        }
      },
    }
  }, [
    openBookmarksInBrowser,
    openFolderInBrowser,
    openMenu,
    options,
    toggleBookmarkTree,
    treeInfo.parent.id,
  ])
}
