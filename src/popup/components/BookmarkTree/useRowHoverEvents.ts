import * as React from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { OPTIONS } from '../../../core/constants/index.js'
import { BOOKMARK_TYPES } from '../../modules/bookmarks/constants.js'
import { useBookmarkTreesContext } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import type {
  BookmarkInfo,
  BookmarkTreeInfo,
} from '../../modules/bookmarks/types.js'
import { useOptions } from '../../modules/options.js'
import { useDragAndDropContext } from '../dragAndDrop/index.js'
import { useListNavigationContext } from '../listNavigation/index.js'

export default function useRowHoverEvents({
  closeNextTrees,
  treeIndex,
  treeInfo,
}: {
  readonly closeNextTrees: () => void
  readonly treeIndex: number
  readonly treeInfo: BookmarkTreeInfo
}) {
  const options = useOptions()

  const { openBookmarkTree } = useBookmarkTreesContext()

  const { activeKey } = useDragAndDropContext()
  const { setHighlightedIndex, unsetHighlightedIndex } =
    useListNavigationContext()

  const toggleBookmarkTree = useDebouncedCallback(
    async (bookmarkInfo: BookmarkInfo) => {
      if (
        bookmarkInfo.type === BOOKMARK_TYPES.FOLDER &&
        bookmarkInfo.id !== activeKey
      ) {
        await openBookmarkTree(bookmarkInfo.id, treeInfo.parent.id)
      } else {
        closeNextTrees()
      }
    },
    300,
  )

  return React.useMemo(() => {
    return {
      handleRowMouseEnter: (bookmarkInfo: BookmarkInfo) => async () => {
        const index = treeInfo.children.findIndex(
          (x) => x.id === bookmarkInfo.id,
        )
        setHighlightedIndex(treeIndex, index)

        if (!options[OPTIONS.OP_FOLDER_BY]) {
          await toggleBookmarkTree(bookmarkInfo)
        }
      },
      handleRowMouseLeave: (bookmarkInfo: BookmarkInfo) => () => {
        toggleBookmarkTree.cancel()

        const index = treeInfo.children.findIndex(
          (x) => x.id === bookmarkInfo.id,
        )
        unsetHighlightedIndex(treeIndex, index)
      },
    }
  }, [
    options,
    setHighlightedIndex,
    toggleBookmarkTree,
    treeIndex,
    treeInfo.children,
    unsetHighlightedIndex,
  ])
}
