import * as React from 'react'
import {connect} from 'react-redux'

import {bookmarkCreators} from '../../reduxs'
import DragAndDropProvider from '../dragAndDrop/DragAndDropProvider'

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const mapDispatchToProps = {
    moveBookmarkToDragIndicator: bookmarkCreators.moveBookmarkToDragIndicator,
    removeDragIndicator: bookmarkCreators.removeDragIndicator
  }

  type Props = P & typeof mapDispatchToProps
  const DragAndDropEvents = (props: Props) => {
    const {moveBookmarkToDragIndicator, removeDragIndicator} = props

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

  return connect(
    null,
    mapDispatchToProps
  )(
    // @ts-ignore
    DragAndDropEvents
  )
}
