import * as React from 'react'

import * as CST from '../../constants'
import { useBookmarkTrees } from '../../modules/bookmarks/contexts/bookmarkTrees'
import type { BookmarkInfo, BookmarkTree } from '../../types'
import type { ResponseEvent } from '../dragAndDrop'

export default function useRowDragEvents({
  closeNextTrees,
  treeInfo,
}: {
  closeNextTrees(): void
  treeInfo: BookmarkTree
}) {
  const { removeDragIndicator, setDragIndicator } = useBookmarkTrees()

  return React.useMemo(() => {
    return {
      handleRowDragOver:
        (bookmarkInfo: BookmarkInfo) =>
        (evt: React.MouseEvent, responseEvent: ResponseEvent) => {
          const targetOffset = evt.currentTarget.getBoundingClientRect()
          const isOverBottomPart =
            evt.clientY - targetOffset.top > targetOffset.height / 2

          const childrenWithoutDragIndicator = treeInfo.children.filter(
            (child) => child.type !== CST.BOOKMARK_TYPES.DRAG_INDICATOR,
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
      handleRowDragStart() {
        closeNextTrees()
      },
    }
  }, [closeNextTrees, removeDragIndicator, setDragIndicator, treeInfo.children])
}
