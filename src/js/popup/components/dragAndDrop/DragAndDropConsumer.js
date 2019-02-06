// @flow strict @jsx createElement

import {PureComponent, createElement} from 'react'
import type {Node} from 'react'

import DragAndDropContext, {type ContextType} from './DragAndDropContext'

export type ResponseEvent = {
  activeKey: string | null,
  itemKey: string
}

type Props = {|
  children: Node,
  className?: string,
  enabled?: boolean,
  itemKey: string,
  onDragOver: (SyntheticMouseEvent<HTMLElement>, ResponseEvent) => void,
  onDragStart: (SyntheticMouseEvent<HTMLElement>, ResponseEvent) => void
|}
type State = {|
  shouldDisableNextClick: boolean
|}
export default class DragAndDrop extends PureComponent<Props, State> {
  context: ContextType
  static contextType = DragAndDropContext
  static defaultProps = {
    enabled: true
  }

  state = {
    shouldDisableNextClick: false
  }

  getResponseEvent = (): ResponseEvent => ({
    activeKey: this.context.activeKey,
    itemKey: this.props.itemKey
  })

  handleClickCapture = (evt: SyntheticMouseEvent<HTMLElement>) => {
    if (this.state.shouldDisableNextClick) {
      evt.stopPropagation()
      this.setState({
        shouldDisableNextClick: false
      })
    }
  }
  handleMouseUpCapture = () => {
    this.setState({
      shouldDisableNextClick: true
    })
  }

  handleDragOver = (evt: SyntheticMouseEvent<HTMLElement>) => {
    this.props.onDragOver(evt, this.getResponseEvent())
  }
  handleBeforeDragStart = (evt: SyntheticMouseEvent<HTMLElement>) => {
    if (evt.buttons !== 1) return

    this.context.setPendingKey(this.props.itemKey)
  }
  handleDragStart = (evt: SyntheticMouseEvent<HTMLElement>) => {
    this.context.setActiveKey(this.props.itemKey)
    this.props.onDragStart(evt, this.getResponseEvent())
  }

  render() {
    const isDragging = this.context.activeKey !== null
    const isPending = this.context.pendingKey === this.props.itemKey
    return (
      <div
        className={this.props.className}
        {...(this.props.enabled !== false ?
          {
            onClickCapture: this.handleClickCapture,
            onMouseDown: isDragging ? null : this.handleBeforeDragStart,
            onMouseMove: isPending ? this.handleDragStart : null,
            onMouseOver: isDragging ? this.handleDragOver : null,
            onMouseUpCapture: isDragging ? this.handleMouseUpCapture : null
          } :
          {})}
      >
        {this.props.children}
      </div>
    )
  }
}
