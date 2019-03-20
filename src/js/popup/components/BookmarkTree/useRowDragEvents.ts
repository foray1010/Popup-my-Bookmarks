import * as React from 'react'

import * as CST from '../../constants'
import {bookmarkCreators} from '../../reduxs'
import {BookmarkInfo, BookmarkTree} from '../../types'
import {ResponseEvent} from '../dragAndDrop/DragAndDropConsumer'

export default ({
  closeNextTrees,
  removeDragIndicator,
  setDragIndicator,
  treeInfo
}: {
  closeNextTrees: () => void
  removeDragIndicator: typeof bookmarkCreators.removeDragIndicator
  setDragIndicator: typeof bookmarkCreators.setDragIndicator
  treeInfo: BookmarkTree
}) => {
  return React.useMemo(() => {
    return {
      handleRowDragOver: (bookmarkInfo: BookmarkInfo) => (
        evt: React.MouseEvent<HTMLElement>,
        responseEvent: ResponseEvent
      ) => {
        const targetOffset = evt.currentTarget.getBoundingClientRect()
        const isOverBottomPart = evt.clientY - targetOffset.top > targetOffset.height / 2

        const childrenWithoutDragIndicator = treeInfo.children.filter(
          (child) => child.type !== CST.BOOKMARK_TYPES.DRAG_INDICATOR
        )

        const activeIndex = childrenWithoutDragIndicator.findIndex(
          (item) => item.id === responseEvent.activeKey
        )
        const currentIndex = childrenWithoutDragIndicator.findIndex(
          (item) => item.id === responseEvent.itemKey
        )
        const targetIndex = currentIndex + (isOverBottomPart ? 1 : 0)

        const isNearActiveItem =
          activeIndex === -1 ? false : [activeIndex, activeIndex + 1].includes(targetIndex)
        if (isNearActiveItem) {
          console.debug('skip as nearby active item')
          removeDragIndicator()
          return
        }

        setDragIndicator(bookmarkInfo.parentId, targetIndex)
      },
      handleRowDragStart: () => {
        closeNextTrees()
      }
    }
  }, [closeNextTrees, removeDragIndicator, setDragIndicator, treeInfo.children])
}
