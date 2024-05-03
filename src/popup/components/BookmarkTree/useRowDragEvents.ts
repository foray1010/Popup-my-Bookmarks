import { type MouseEvent, useMemo } from 'react'

import { BOOKMARK_TYPES } from '../../modules/bookmarks/constants.js'
import { useBookmarkTreesContext } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import type {
  BookmarkInfo,
  BookmarkTreeInfo,
} from '../../modules/bookmarks/types.js'
import type { ResponseEvent } from '../dragAndDrop/index.js'

export default function useRowDragEvents({
  closeNextTrees,
  treeInfo,
}: Readonly<{ closeNextTrees: () => void; treeInfo: BookmarkTreeInfo }>) {
  const { removeDragIndicator, setDragIndicator } = useBookmarkTreesContext()

  return useMemo(() => {
    return {
      handleRowDragOver:
        (bookmarkInfo: BookmarkInfo) =>
        (evt: Readonly<MouseEvent>, responseEvent: ResponseEvent) => {
          if (
            !bookmarkInfo.parentId ||
            // avoid infinite loop
            bookmarkInfo.type === BOOKMARK_TYPES.DRAG_INDICATOR
          ) {
            return
          }

          const targetOffset = evt.currentTarget.getBoundingClientRect()
          const isOverBottomPart =
            evt.clientY - targetOffset.top > targetOffset.height / 2

          const childrenWithoutDragIndicator = treeInfo.children.filter(
            (child) => child.type !== BOOKMARK_TYPES.DRAG_INDICATOR,
          )

          const activeIndex = childrenWithoutDragIndicator.findIndex(
            (item) => item.id === responseEvent.activeKey,
          )
          const currentIndex = childrenWithoutDragIndicator.findIndex(
            (item) => item.id === responseEvent.itemKey,
          )
          const targetIndex = currentIndex + (isOverBottomPart ? 1 : 0)

          const isNearActiveItem =
            activeIndex === -1
              ? false
              : [activeIndex, activeIndex + 1].includes(targetIndex)
          if (isNearActiveItem) {
            console.debug('skip as nearby active item')
            removeDragIndicator()
            return
          }

          setDragIndicator(bookmarkInfo.parentId, targetIndex)
        },
      handleRowDragStart: closeNextTrees,
    }
  }, [closeNextTrees, removeDragIndicator, setDragIndicator, treeInfo.children])
}
