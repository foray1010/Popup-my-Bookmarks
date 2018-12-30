// @flow strict @jsx createElement

import {Fragment, type Node, PureComponent, createElement} from 'react'
import EventListener from 'react-event-listener'

import DragAndDropContext, {type ContextType} from './DragAndDropContext'

type Props = {|
  children: Node,
  onDragEnd: (SyntheticMouseEvent<HTMLElement>) => void,
  onDrop: (SyntheticMouseEvent<HTMLElement>, string) => void
|}
type State = {|
  contextValue: ContextType
|}
export default class DragAndDropProvider extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      contextValue: {
        activeKey: null,
        setActiveKey: this.setActiveKey
      }
    }
  }

  setActiveKey = (activeKey: string) => {
    this.setState((prevState) => ({
      contextValue: {...prevState.contextValue, activeKey}
    }))
  }
  unsetActiveKey = () => {
    this.setState((prevState) => ({
      contextValue: {...prevState.contextValue, activeKey: null}
    }))
  }

  handleDrop = (evt: SyntheticMouseEvent<HTMLElement>) => {
    // save it first as it will be reset by `unsetActiveKey`
    const {activeKey} = this.state.contextValue

    this.unsetActiveKey()
    if (activeKey !== null) this.props.onDrop(evt, activeKey)
    this.props.onDragEnd(evt)
  }

  // may not be needed, just in case
  handleMouseEnterWindow = (evt: SyntheticMouseEvent<HTMLElement>) => {
    // if user mouse up outside of the window, `mouseup` event may not be fired
    // this hack let us know if user mouse up outside of the window and go back to window
    // onDrop() should not be called because we are not sure that means user wanna drop
    if (evt.buttons !== 1) {
      this.unsetActiveKey()
      this.props.onDragEnd(evt)
    }
  }

  render() {
    return (
      <Fragment>
        <DragAndDropContext.Provider value={this.state.contextValue}>
          {this.props.children}
        </DragAndDropContext.Provider>
        {this.state.contextValue.activeKey !== null && (
          <EventListener
            target={window}
            onMouseEnter={this.handleMouseEnterWindow}
            onMouseUp={this.handleDrop}
          />
        )}
      </Fragment>
    )
  }
}
