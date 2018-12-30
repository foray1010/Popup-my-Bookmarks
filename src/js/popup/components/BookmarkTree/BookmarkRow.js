// @flow strict

import classNames from 'classnames'
import * as R from 'ramda'
import * as React from 'react'
import styled from 'styled-components'

import classes from '../../../../css/popup/bookmark-row.css'
import * as CST from '../../constants'
import type {BookmarkInfo} from '../../types'
import DragAndDropConsumer, {type ResponseEvent} from '../dragAndDrop/DragAndDropConsumer'

const IconImg = styled('img')`
  width: ${R.prop('iconSize')}px;
`

type Props = {|
  bookmarkInfo: BookmarkInfo,
  iconSize: number,
  isDisableDragging: boolean,
  isHighlighted: boolean,
  onAuxClick: (string) => (MouseEvent) => void,
  onClick: (string) => (SyntheticMouseEvent<HTMLElement>) => void,
  onDragOver: (BookmarkInfo) => (SyntheticMouseEvent<HTMLElement>, ResponseEvent) => void,
  onDragStart: () => void,
  onMouseEnter: (BookmarkInfo) => () => void,
  onMouseLeave: () => void
|}
class BookmarkRow extends React.PureComponent<Props> {
  baseEl: ?HTMLElement

  componentDidMount() {
    // temp fix for https://github.com/facebook/react/issues/8529
    // $FlowFixMe // flow does not support auxclick event
    if (this.baseEl) this.baseEl.addEventListener('auxclick', this.handleAuxClick)
  }

  componentWillUnmount() {
    // $FlowFixMe // flow does not support auxclick event
    if (this.baseEl) this.baseEl.removeEventListener('auxclick', this.handleAuxClick)
  }

  handleAuxClick = this.props.onAuxClick(this.props.bookmarkInfo.id)
  handleClick = this.props.onClick(this.props.bookmarkInfo.id)
  handleDragOver = this.props.onDragOver(this.props.bookmarkInfo)
  handleMouseEnter = this.props.onMouseEnter(this.props.bookmarkInfo)

  render = () => (
    <DragAndDropConsumer
      className={classes['full-height']}
      enabled={!this.props.isDisableDragging}
      itemKey={this.props.bookmarkInfo.id}
      onDragOver={this.handleDragOver}
      onDragStart={this.props.onDragStart}
    >
      <div
        ref={(ref) => {
          this.baseEl = ref
        }}
        className={classNames(classes.main, classes['full-height'], {
          [classes.highlighted]: this.props.isHighlighted,
          [classes['root-folder']]: this.props.bookmarkInfo.isRoot,
          [classes.separator]: this.props.bookmarkInfo.type === CST.TYPE_SEPARATOR
        })}
        onClick={this.handleClick}
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
