// @flow strict

import * as React from 'react'
import EventListener from 'react-event-listener'

import DragAndDropContext, {type ContextType} from './DragAndDropContext'

type Props = {|
  children: React.Node,
  onDragEnd: (SyntheticMouseEvent<HTMLElement>) => void,
  onDrop: (SyntheticMouseEvent<HTMLElement>, string) => void
|}
type State = {|
  contextValue: ContextType
|}
export default class DragAndDropProvider extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      contextValue: {
        activeKey: null,
        pendingKey: null,
        setActiveKey: this.setActiveKey,
        setPendingKey: this.setPendingKey
      }
    }
  }

  updateContextValue = (partialContextValue: $Shape<ContextType>) => {
    this.setState((prevState) => ({
      contextValue: {...prevState.contextValue, ...partialContextValue}
    }))
  }

  setActiveKey = (activeKey: string) => {
    this.updateContextValue({
      activeKey,
      pendingKey: null
    })
  }
  setPendingKey = (pendingKey: string) => {
    this.updateContextValue({
      activeKey: null,
      pendingKey
    })
  }

  resetContextValue = () => {
    this.updateContextValue({
      activeKey: null,
      pendingKey: null
    })
  }

  handleDrop = (evt: SyntheticMouseEvent<HTMLElement>) => {
    // save it first as it will be reset by `resetContextValue`
    const {activeKey} = this.state.contextValue

    this.resetContextValue()
    if (activeKey !== null) this.props.onDrop(evt, activeKey)
    this.props.onDragEnd(evt)
  }

  // may not be needed, just in case
  handleMouseEnterWindow = (evt: SyntheticMouseEvent<HTMLElement>) => {
    // if user mouse up outside of the window, `mouseup` event may not be fired
    // this hack let us know if user mouse up outside of the window and go back to window
    // onDrop() should not be called because we are not sure that means user wanna drop
    if (evt.buttons !== 1) {
      this.resetContextValue()
      this.props.onDragEnd(evt)
    }
  }

  render() {
    return (
      <>
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
      </>
    )
  }
}
