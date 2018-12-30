// @flow strict @jsx createElement

import {type ComponentType, PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import {bookmarkCreators} from '../../reduxs'
import DragAndDropProvider from '../dragAndDrop/DragAndDropProvider'

export default <P>(WrappedComponent: ComponentType<P>) => {
  type Props = {|
    ...P,
    removeDragIndicator: () => void
  |}
  class DragAndDropEvents extends PureComponent<Props> {
    handleDragEnd = () => {
      this.props.removeDragIndicator()
    }

    handleDrop = () => {
      console.log('drop')
    }

    render = () => (
      <DragAndDropProvider onDragEnd={this.handleDragEnd} onDrop={this.handleDrop}>
        <WrappedComponent {...this.props} />
      </DragAndDropProvider>
    )
  }

  const mapDispatchToProps = {
    removeDragIndicator: bookmarkCreators.removeDragIndicator
  }

  return connect(
    null,
    mapDispatchToProps
  )(DragAndDropEvents)
}
