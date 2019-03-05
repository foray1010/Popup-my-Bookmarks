import * as React from 'react'

import DragAndDropContext, {ContextType} from './DragAndDropContext'

export interface ResponseEvent {
  activeKey: string | null
  itemKey: string
}

interface Props {
  children: React.ReactNode
  className?: string
  disableDrag?: boolean
  disableDrop?: boolean
  itemKey: string
  onDragOver: (evt: React.MouseEvent<HTMLElement>, responseEvent: ResponseEvent) => void
  onDragStart: (evt: React.MouseEvent<HTMLElement>, responseEvent: ResponseEvent) => void
}
interface State {
  shouldDisableNextClick: boolean
}
export default class DragAndDrop extends React.PureComponent<Props, State> {
  public context: ContextType
  public static contextType = DragAndDropContext

  public state = {
    shouldDisableNextClick: false
  }

  private getResponseEvent = (): ResponseEvent => ({
    activeKey: this.context.activeKey,
    itemKey: this.props.itemKey
  })

  private handleClickCapture = (evt: React.MouseEvent<HTMLElement>) => {
    if (this.state.shouldDisableNextClick) {
      evt.stopPropagation()
      this.setState({
        shouldDisableNextClick: false
      })
    }
  }
  private handleMouseUpCapture = () => {
    this.setState({
      shouldDisableNextClick: true
    })
  }

  private handleDragOver = (evt: React.MouseEvent<HTMLElement>) => {
    this.props.onDragOver(evt, this.getResponseEvent())
  }
  private handleBeforeDragStart = (evt: React.MouseEvent<HTMLElement>) => {
    if (evt.buttons !== 1) return

    this.context.setPendingKey(this.props.itemKey)
  }
  private handleDragStart = (evt: React.MouseEvent<HTMLElement>) => {
    this.context.setActiveKey(this.props.itemKey)
    this.props.onDragStart(evt, this.getResponseEvent())
  }

  public render() {
    const isDragging = this.context.activeKey !== null
    const isPending = this.context.pendingKey === this.props.itemKey
    return (
      <div
        className={this.props.className}
        onClickCapture={this.handleClickCapture}
        onMouseUpCapture={isDragging ? this.handleMouseUpCapture : undefined}
        {...(this.props.disableDrag !== true ?
          {
            onMouseDown: isDragging ? undefined : this.handleBeforeDragStart,
            onMouseMove: isPending ? this.handleDragStart : undefined
          } :
          {})}
        {...(this.props.disableDrop !== true ?
          {
            onMouseOver: isDragging ? this.handleDragOver : undefined
          } :
          {})}
      >
        {this.props.children}
      </div>
    )
  }
}
