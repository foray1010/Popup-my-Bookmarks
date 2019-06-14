import * as React from 'react'

import useAction from '../../../common/hooks/useAction'
import {bookmarkCreators} from '../../reduxs'
import DragAndDropProvider from '../dragAndDrop/DragAndDropProvider'

export default <P extends {}>(WrappedComponent: React.ComponentType<P>) => {
  const DragAndDropEvents = (props: P) => {
    const moveBookmarkToDragIndicator = useAction(bookmarkCreators.moveBookmarkToDragIndicator)
    const removeDragIndicator = useAction(bookmarkCreators.removeDragIndicator)

    const handleDragEnd = React.useCallback(() => {
      removeDragIndicator()
    }, [removeDragIndicator])

    const handleDrop = React.useCallback(
      (evt: MouseEvent, activeKey: string) => {
        moveBookmarkToDragIndicator(activeKey)
      },
      [moveBookmarkToDragIndicator]
    )

    return (
      <DragAndDropProvider onDragEnd={handleDragEnd} onDrop={handleDrop}>
        <WrappedComponent {...props} />
      </DragAndDropProvider>
    )
  }

  return DragAndDropEvents
}
