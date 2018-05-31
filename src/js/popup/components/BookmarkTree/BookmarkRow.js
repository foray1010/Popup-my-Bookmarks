// @flow strict
// @jsx createElement

import '../../../../css/popup/bookmark-row.css'

import classNames from 'classnames'
import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import styled from 'styled-components'

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

  baseEl: ?HTMLElement
  render = () => (
    <div
      ref={(ref) => {
        this.baseEl = ref
      }}
      styleName={classNames('main', {
        highlighted: this.props.isHighlighted,
        'root-folder': this.props.bookmarkInfo.isRoot,
        separator: this.props.bookmarkInfo.type === CST.TYPE_SEPARATOR
      })}
      onClick={this.handleClick}
      onMouseEnter={this.handleMouseEnter}
      onMouseLeave={this.props.onMouseLeave}
    >
      {this.props.bookmarkInfo.iconUrl && (
        <IconImg
          iconSize={this.props.iconSize}
          styleName='icon'
          src={this.props.bookmarkInfo.iconUrl}
          alt=''
        />
      )}
      <div styleName='title'>{this.props.bookmarkInfo.title}</div>
    </div>
  )
}

export default BookmarkRow
