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
  class DragAndDropEvents extends React.PureComponent<Props> {
    private handleDragEnd = () => {
      this.props.removeDragIndicator()
    }

    private handleDrop = (evt: MouseEvent, activeKey: string) => {
      this.props.moveBookmarkToDragIndicator(activeKey)
    }

    public render = () => (
      <DragAndDropProvider onDragEnd={this.handleDragEnd} onDrop={this.handleDrop}>
        <WrappedComponent {...this.props} />
      </DragAndDropProvider>
    )
  }

  return connect(
    null,
    mapDispatchToProps
  )(DragAndDropEvents)
}
