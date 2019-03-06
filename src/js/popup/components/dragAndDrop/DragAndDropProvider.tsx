import * as React from 'react'
import EventListener from 'react-event-listener'

import DragAndDropContext, {ContextType} from './DragAndDropContext'

interface Props {
  children: React.ReactNode
  onDragEnd: (evt: MouseEvent) => void
  onDrop: (evt: MouseEvent, activeKey: string) => void
}
interface State {
  contextValue: ContextType
}
export default class DragAndDropProvider extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
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

  private updateContextValue = (partialContextValue: Partial<ContextType>) => {
    this.setState((prevState) => ({
      contextValue: {...prevState.contextValue, ...partialContextValue}
    }))
  }

  private setActiveKey = (activeKey: string) => {
    this.updateContextValue({
      activeKey,
      pendingKey: null
    })
  }
  private setPendingKey = (pendingKey: string) => {
    this.updateContextValue({
      activeKey: null,
      pendingKey
    })
  }

  private resetContextValue = () => {
    this.updateContextValue({
      activeKey: null,
      pendingKey: null
    })
  }

  private handleDrop = (evt: MouseEvent) => {
    // save it first as it will be reset by `resetContextValue`
    const {activeKey} = this.state.contextValue

    this.resetContextValue()
    if (activeKey !== null) this.props.onDrop(evt, activeKey)
    this.props.onDragEnd(evt)
  }

  // may not be needed, just in case
  private handleMouseEnterWindow = (evt: MouseEvent) => {
    // if user mouse up outside of the window, `mouseup` event may not be fired
    // this hack let us know if user mouse up outside of the window and go back to window
    // onDrop() should not be called because we are not sure that means user wanna drop
    if (evt.buttons !== 1) {
      this.resetContextValue()
      this.props.onDragEnd(evt)
    }
  }

  public render() {
    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  }
}
