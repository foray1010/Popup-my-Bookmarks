import { useMemo } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { OPTIONS } from '@/core/constants/index.js'
import { BOOKMARK_TYPES } from '@/popup/modules/bookmarks/constants.js'
import { useBookmarkTreesContext } from '@/popup/modules/bookmarks/contexts/bookmarkTrees.js'
import type {
  BookmarkInfo,
  BookmarkTreeInfo,
} from '@/popup/modules/bookmarks/types.js'
import { useOptions } from '@/popup/modules/options.js'

import { useDragAndDropContext } from '../dragAndDrop/index.js'
import { useListNavigationContext } from '../listNavigation/index.js'

export default function useRowHoverEvents({
  closeNextTrees,
  treeIndex,
  treeInfo,
}: Readonly<{
  closeNextTrees: () => void
  treeIndex: number
  treeInfo: BookmarkTreeInfo
}>) {
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

  return useMemo(() => {
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
