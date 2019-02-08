// @flow strict @jsx createElement

import {type ComponentType, PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import {bookmarkCreators} from '../../reduxs'
import DragAndDropProvider from '../dragAndDrop/DragAndDropProvider'

export default <P>(WrappedComponent: ComponentType<P>) => {
  type Props = {|
    ...P,
    moveBookmarkToDragIndicator: (string) => void,
    removeDragIndicator: () => void
  |}
  class DragAndDropEvents extends PureComponent<Props> {
    handleDragEnd = () => {
      this.props.removeDragIndicator()
    }

    handleDrop = (evt: SyntheticMouseEvent<HTMLElement>, activeKey: string) => {
      this.props.moveBookmarkToDragIndicator(activeKey)
    }

    render = () => (
      <DragAndDropProvider onDragEnd={this.handleDragEnd} onDrop={this.handleDrop}>
        <WrappedComponent {...this.props} />
      </DragAndDropProvider>
    )
  }

  const mapDispatchToProps = {
    moveBookmarkToDragIndicator: bookmarkCreators.moveBookmarkToDragIndicator,
    removeDragIndicator: bookmarkCreators.removeDragIndicator
  }

  return connect(
    null,
    mapDispatchToProps
  )(DragAndDropEvents)
}
