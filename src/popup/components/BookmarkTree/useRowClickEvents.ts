import * as React from 'react'

import {
  BOOKMARK_TYPES,
  OPEN_IN_TYPES,
  OPTIONS,
} from '../../constants/index.js'
import { useBookmarkTrees } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import {
  openBookmarksInBrowser,
  openFolderInBrowser,
} from '../../modules/bookmarks/methods/openBookmark.js'
import {
  getClickOptionNameByEvent,
  mapOptionToOpenBookmarkProps,
} from '../../modules/bookmarks/utils/clickBookmark.js'
import { useOptions } from '../../modules/options.js'
import type { BookmarkInfo, BookmarkTree } from '../../types/index.js'
import { useMenuContext } from '../menu/index.js'

export default function useRowClickEvents({
  treeInfo,
}: {
  readonly treeInfo: BookmarkTree
}) {
  const options = useOptions()

  const { toggleBookmarkTree } = useBookmarkTrees()

  const { open: openMenu } = useMenuContext()

  return React.useMemo(() => {
    const handleRowMiddleClick = async (bookmarkInfo: BookmarkInfo) => {
      if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
        await openFolderInBrowser(bookmarkInfo.id, {
          openIn: OPEN_IN_TYPES.NEW_TAB,
          isAllowBookmarklet: false,
          isCloseThisExtension: true,
        })
      } else {
        const openBookmarkProps = mapOptionToOpenBookmarkProps(
          options[OPTIONS.CLICK_BY_MIDDLE],
        )
        await openBookmarksInBrowser([bookmarkInfo.id], {
          ...openBookmarkProps,
          isAllowBookmarklet: true,
        })
      }
    }
    const handleRowRightClick = (
      bookmarkInfo: BookmarkInfo,
      evt: React.MouseEvent,
    ) => {
      const offset = document
        .querySelector(`[data-bookmarkid="${bookmarkInfo.id}"`)
        ?.getBoundingClientRect()
      openMenu({
        targetId: bookmarkInfo.id,
        displayPositions: {
          top: evt.clientY,
          left: evt.clientX,
        },
        targetPositions: {
          top: offset?.top ?? 0,
          left: offset?.left ?? 0,
        },
      })
    }

    return {
      handleRowAuxClick:
        (bookmarkInfo: BookmarkInfo) => async (evt: React.MouseEvent) => {
          if (evt.button === 1) {
            await handleRowMiddleClick(bookmarkInfo)
          }
        },
      handleRowClick:
        (bookmarkInfo: BookmarkInfo) => async (evt: React.MouseEvent) => {
          if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
            if (options[OPTIONS.OP_FOLDER_BY]) {
              await toggleBookmarkTree(bookmarkInfo.id, treeInfo.parent.id)
            }
          } else {
            const option = options[getClickOptionNameByEvent(evt)]
            const openBookmarkProps = mapOptionToOpenBookmarkProps(option)
            await openBookmarksInBrowser([bookmarkInfo.id], {
              ...openBookmarkProps,
              isAllowBookmarklet: true,
            })
          }
        },
      handleRowContextMenu:
        (bookmarkInfo: BookmarkInfo) => (evt: React.MouseEvent) => {
          handleRowRightClick(bookmarkInfo, evt)
        },
    }
  }, [openMenu, options, toggleBookmarkTree, treeInfo.parent.id])
}
