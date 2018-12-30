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
    if (this.context.activeKey !== null) {
      this.setState({
        shouldDisableNextClick: true
      })
    }
  }

  handleDragOver = (evt: SyntheticMouseEvent<HTMLElement>) => {
    this.props.onDragOver(evt, this.getResponseEvent())
  }
  handleDragStart = (evt: SyntheticMouseEvent<HTMLElement>) => {
    if (evt.buttons !== 1) return
    if (this.context.activeKey !== null) return

    this.context.setActiveKey(this.props.itemKey)
    this.props.onDragStart(evt, this.getResponseEvent())
  }

  render() {
    const isDragging = this.context.activeKey !== null
    return (
      <div
        className={this.props.className}
        {...(this.props.enabled !== false ?
          {
            onClickCapture: this.handleClickCapture,
            onMouseMove: this.handleDragStart,
            onMouseOver: isDragging ? this.handleDragOver : null,
            onMouseUpCapture: this.handleMouseUpCapture
          } :
          {})}
      >
        {this.props.children}
      </div>
    )
  }
}
