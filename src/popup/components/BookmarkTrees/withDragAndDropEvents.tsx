import * as React from 'react'

import { useBookmarkTrees } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import { DragAndDropProvider } from '../dragAndDrop/index.js'

export default function withDragAndDropEvents<P extends {}>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function ComponentWithDragAndDropEvents(props: P) {
    const { moveBookmarkToDragIndicator, removeDragIndicator } =
      useBookmarkTrees()

    return (
      <DragAndDropProvider
        onDragEnd={removeDragIndicator}
        onDrop={React.useCallback(
          (evt: MouseEvent, activeKey: string) => {
            moveBookmarkToDragIndicator(activeKey)
          },
          [moveBookmarkToDragIndicator],
        )}
      >
        <WrappedComponent {...props} />
      </DragAndDropProvider>
    )
  }
}
