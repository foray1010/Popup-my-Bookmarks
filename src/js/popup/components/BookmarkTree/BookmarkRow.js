// @flow strict @jsx createElement

import classNames from 'classnames'
import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import styled from 'styled-components'

import classes from '../../../../css/popup/bookmark-row.css'
import * as CST from '../../constants'
import type {BookmarkInfo} from '../../types'

const IconImg = styled('img')`
  width: ${R.prop('iconSize')}px;
`

type Props = {|
  bookmarkInfo: BookmarkInfo,
  iconSize: number,
  isHighlighted: boolean,
  onAuxClick: (string) => (MouseEvent) => void,
  onClick: (string) => (SyntheticMouseEvent<HTMLElement>) => void,
  onMouseEnter: (BookmarkInfo) => () => void,
  onMouseLeave: () => void
|}
class BookmarkRow extends PureComponent<Props> {
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
  handleMouseEnter = this.props.onMouseEnter(this.props.bookmarkInfo)

  render = () => (
    <div
      ref={(ref) => {
        this.baseEl = ref
      }}
      className={classNames(classes.main, {
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
  )
}

export default BookmarkRow
