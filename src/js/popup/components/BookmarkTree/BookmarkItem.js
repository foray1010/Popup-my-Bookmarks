// @flow
// @jsx createElement

import '../../../../css/popup/bookmark-item.css'

import classNames from 'classnames'
import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import styled from 'react-emotion'

import * as CST from '../../constants'

const IconImg = styled('img')`
  width: ${R.prop('iconSize')}px;
`

type Props = {|
  bookmarkInfo: Object,
  iconSize: number,
  isFocused: boolean,
  onMouseEnter: (string) => () => void,
  onMouseLeave: () => void
|}
class BookmarkItem extends PureComponent<Props> {
  handleMouseEnter = this.props.onMouseEnter(this.props.bookmarkInfo.id)

  render = () => (
    <div
      styleName={classNames('main', {
        focused: this.props.isFocused,
        'root-folder': this.props.bookmarkInfo.isRoot,
        separator: this.props.bookmarkInfo.type === CST.TYPE_SEPARATOR
      })}
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

export default BookmarkItem
