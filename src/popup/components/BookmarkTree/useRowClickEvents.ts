import * as React from 'react'

import { OPTIONS } from '../../../core/constants/index.js'
import { OPEN_IN_TYPES } from '../../constants/menu.js'
import { BOOKMARK_TYPES } from '../../modules/bookmarks/constants.js'
import { useBookmarkTreesContext } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import {
  openBookmarksInBrowser,
  openFolderInBrowser,
} from '../../modules/bookmarks/methods/openBookmark.js'
import type {
  BookmarkInfo,
  BookmarkTreeInfo,
} from '../../modules/bookmarks/types.js'
import {
  getClickOptionNameByEvent,
  mapOptionToOpenBookmarkProps,
} from '../../modules/bookmarks/utils/clickBookmark.js'
import { useOptions } from '../../modules/options.js'
import { useMenuContext } from '../menu/index.js'

export default function useRowClickEvents({
  treeInfo,
}: Readonly<{ treeInfo: BookmarkTreeInfo }>) {
  const options = useOptions()

  const { toggleBookmarkTree } = useBookmarkTreesContext()

  const { open: openMenu } = useMenuContext()

  return React.useMemo(() => {
    async function handleRowMiddleClick(bookmarkInfo: BookmarkInfo) {
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
    function handleRowRightClick(
      bookmarkInfo: BookmarkInfo,
      evt: React.MouseEvent,
    ) {
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
          switch (bookmarkInfo.type) {
            case BOOKMARK_TYPES.FOLDER:
              if (options[OPTIONS.OP_FOLDER_BY]) {
                await toggleBookmarkTree(bookmarkInfo.id, treeInfo.parent.id)
              }
              break

            case BOOKMARK_TYPES.BOOKMARK: {
              const option = options[getClickOptionNameByEvent(evt)]
              const openBookmarkProps = mapOptionToOpenBookmarkProps(option)
              await openBookmarksInBrowser([bookmarkInfo.id], {
                ...openBookmarkProps,
                isAllowBookmarklet: true,
              })
              break
            }

            case BOOKMARK_TYPES.DRAG_INDICATOR:
            case BOOKMARK_TYPES.NO_BOOKMARK:
            case BOOKMARK_TYPES.SEPARATOR:
              break
          }
        },
      handleRowContextMenu:
        (bookmarkInfo: BookmarkInfo) => (evt: React.MouseEvent) => {
          handleRowRightClick(bookmarkInfo, evt)
        },
    }
  }, [openMenu, options, toggleBookmarkTree, treeInfo.parent.id])
}
