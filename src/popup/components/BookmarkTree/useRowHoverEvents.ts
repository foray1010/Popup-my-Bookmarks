import * as React from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { BOOKMARK_TYPES, OPTIONS } from '../../constants'
import { useBookmarkTrees } from '../../modules/bookmarks/contexts/bookmarkTrees'
import { useOptions } from '../../modules/options'
import type { BookmarkInfo, BookmarkTree } from '../../types'
import { useDragAndDropContext } from '../dragAndDrop'
import { useListNavigationContext } from '../listNavigation'

export default function useRowHoverEvents({
  closeNextTrees,
  treeIndex,
  treeInfo,
}: {
  closeNextTrees(): void
  treeIndex: number
  treeInfo: BookmarkTree
}) {
  const options = useOptions()

  const { openBookmarkTree } = useBookmarkTrees()

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
