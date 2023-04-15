import * as React from 'react'

import { useBookmarkTreesContext } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import { DragAndDropProvider } from '../dragAndDrop/index.js'

export default function withDragAndDropEvents<P extends {}>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function ComponentWithDragAndDropEvents(props: P) {
    const { moveBookmarkToDragIndicator, removeDragIndicator } =
      useBookmarkTreesContext()

    return (
      <DragAndDropProvider
        onDragEnd={removeDragIndicator}
        onDrop={React.useCallback(
          (evt: Readonly<MouseEvent>, activeKey: string) => {
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
