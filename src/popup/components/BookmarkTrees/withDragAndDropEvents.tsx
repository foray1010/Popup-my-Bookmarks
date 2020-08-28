import * as React from 'react'

import useAction from '../../../core/hooks/useAction'
import { bookmarkCreators } from '../../reduxs'
import { DragAndDropProvider } from '../dragAndDrop/DragAndDropContext'

export default function withDragAndDropEvents<P>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function ComponentWithDragAndDropEvents(props: P) {
    const moveBookmarkToDragIndicator = useAction(
      bookmarkCreators.moveBookmarkToDragIndicator,
    )
    const removeDragIndicator = useAction(bookmarkCreators.removeDragIndicator)

    const handleDragEnd = React.useCallback(() => {
      removeDragIndicator()
    }, [removeDragIndicator])

    const handleDrop = React.useCallback(
      (evt: MouseEvent, activeKey: string) => {
        moveBookmarkToDragIndicator(activeKey)
      },
      [moveBookmarkToDragIndicator],
    )

    return (
      <DragAndDropProvider onDragEnd={handleDragEnd} onDrop={handleDrop}>
        <WrappedComponent {...props} />
      </DragAndDropProvider>
    )
  }
}
