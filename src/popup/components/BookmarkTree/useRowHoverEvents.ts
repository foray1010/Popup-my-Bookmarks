import debounce from 'lodash.debounce'
import * as React from 'react'
import { useSelector } from 'react-redux'

import useAction from '../../../core/hooks/useAction'
import { BOOKMARK_TYPES, OPTIONS } from '../../constants'
import type { RootState } from '../../reduxs'
import { bookmarkCreators } from '../../reduxs'
import type { BookmarkInfo, BookmarkTree } from '../../types'
import { useDragAndDropContext } from '../dragAndDrop/DragAndDropContext'
import { useListNavigationContext } from '../listNavigation/ListNavigationContext'

export default function useRowHoverEvents({
  closeNextTrees,
  treeIndex,
  treeInfo,
}: {
  closeNextTrees: () => void
  treeIndex: number
  treeInfo: BookmarkTree
}) {
  const options = useSelector((state: RootState) => state.options)

  const openBookmarkTree = useAction(bookmarkCreators.openBookmarkTree)

  const { activeKey } = useDragAndDropContext()
  const {
    setHighlightedIndex,
    unsetHighlightedIndex,
  } = useListNavigationContext()

  return React.useMemo(() => {
    const toggleBookmarkTree = debounce((bookmarkInfo: BookmarkInfo) => {
      if (
        bookmarkInfo.type === BOOKMARK_TYPES.FOLDER &&
        bookmarkInfo.id !== activeKey
      ) {
        openBookmarkTree(bookmarkInfo.id, treeInfo.parent.id)
      } else {
        closeNextTrees()
      }
    }, 300)

    return {
      handleRowMouseEnter: (bookmarkInfo: BookmarkInfo) => () => {
        if (!options[OPTIONS.OP_FOLDER_BY]) toggleBookmarkTree(bookmarkInfo)

        const index = treeInfo.children.findIndex(
          (x) => x.id === bookmarkInfo.id,
        )
        setHighlightedIndex(treeIndex, index)
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
    activeKey,
    closeNextTrees,
    openBookmarkTree,
    options,
    setHighlightedIndex,
    treeIndex,
    treeInfo.children,
    treeInfo.parent.id,
    unsetHighlightedIndex,
  ])
}
