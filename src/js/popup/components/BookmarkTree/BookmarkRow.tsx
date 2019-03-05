import classNames from 'classnames'
import * as R from 'ramda'
import * as React from 'react'
import styled from 'styled-components'

import classes from '../../../../css/popup/bookmark-row.css'
import * as CST from '../../constants'
import {BookmarkInfo} from '../../types'
import DragAndDropConsumer, {ResponseEvent} from '../dragAndDrop/DragAndDropConsumer'

interface IconImgProps {
  iconSize: number
}
const IconImg = styled('img')<IconImgProps>`
  width: ${R.prop('iconSize')}px;
`

interface Props {
  bookmarkInfo: BookmarkInfo
  iconSize: number
  isDisableDragAndDrop: boolean
  isHighlighted: boolean
  isUnclickable: boolean
  onAuxClick: (bookmarkId: string) => (evt: MouseEvent) => void
  onClick: (bookmarkId: string) => (evt: React.MouseEvent<HTMLElement>) => void
  onDragOver: (
    bookmarkInfo: BookmarkInfo
  ) => (evt: React.MouseEvent<HTMLElement>, responseEvent: ResponseEvent) => void
  onDragStart: () => void
  onMouseEnter: (bookmarkInfo: BookmarkInfo) => () => void
  onMouseLeave: () => void
}
class BookmarkRow extends React.PureComponent<Props> {
  public componentDidMount() {
    // @ts-ignore: https://github.com/Microsoft/TypeScript/issues/29995
    if (this.baseEl) this.baseEl.addEventListener('auxclick', this.handleAuxClick)
  }

  public componentWillUnmount() {
    // @ts-ignore: https://github.com/Microsoft/TypeScript/issues/29995
    if (this.baseEl) this.baseEl.removeEventListener('auxclick', this.handleAuxClick)
  }

  private baseEl: HTMLElement | null = null

  private handleAuxClick = this.props.onAuxClick(this.props.bookmarkInfo.id)
  private handleClick = this.props.onClick(this.props.bookmarkInfo.id)
  private handleDragOver = this.props.onDragOver(this.props.bookmarkInfo)
  private handleMouseEnter = this.props.onMouseEnter(this.props.bookmarkInfo)

  public render = () => (
    <DragAndDropConsumer
      className={classes['full-height']}
      disableDrag={
        this.props.isDisableDragAndDrop ||
        this.props.bookmarkInfo.isRoot ||
        this.props.bookmarkInfo.type === CST.BOOKMARK_TYPES.NO_BOOKMARK
      }
      disableDrop={this.props.isDisableDragAndDrop}
      itemKey={this.props.bookmarkInfo.id}
      onDragOver={this.handleDragOver}
      onDragStart={this.props.onDragStart}
    >
      <div
        ref={(ref) => {
          this.baseEl = ref
        }}
        className={classNames(classes.main, classes['full-height'], {
          [classes.highlighted]:
            this.props.isHighlighted &&
            this.props.bookmarkInfo.type !== CST.BOOKMARK_TYPES.DRAG_INDICATOR,
          [classes['root-folder']]: this.props.bookmarkInfo.isRoot,
          [classes['drag-indicator']]:
            this.props.bookmarkInfo.type === CST.BOOKMARK_TYPES.DRAG_INDICATOR,
          [classes.separator]: this.props.bookmarkInfo.type === CST.BOOKMARK_TYPES.SEPARATOR,
          [classes.unclickable]: this.props.isUnclickable
        })}
        onClick={this.props.isUnclickable ? undefined : this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        {this.props.bookmarkInfo.iconUrl && (
          <IconImg
            iconSize={this.props.iconSize}
            className={classes.icon}
            src={this.props.bookmarkInfo.iconUrl}
            alt=''
          />
        )}
        <div className={classes.title}>{this.props.bookmarkInfo.title}</div>
      </div>
    </DragAndDropConsumer>
  )
}

export default BookmarkRow
