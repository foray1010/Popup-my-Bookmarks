// @flow
// @jsx createElement

import '../../../../css/popup/bookmark-item.css'

import classNames from 'classnames'
import {PureComponent, createElement} from 'react'

type Props = {|
  bookmarkInfo: Object,
  isFocused: boolean,
  onMouseEnter: (string) => () => void,
  onMouseLeave: () => void
|}
class BookmarkItem extends PureComponent<Props> {
  handleMouseEnter = this.props.onMouseEnter(this.props.bookmarkInfo.id)

  render = () => (
    <div
      styleName={classNames('main', {focused: this.props.isFocused})}
      onMouseEnter={this.handleMouseEnter}
      onMouseLeave={this.props.onMouseLeave}
    >
      {this.props.bookmarkInfo.iconUrl && (
        <img styleName='icon' src={this.props.bookmarkInfo.iconUrl} alt='' />
      )}
      <div styleName='title'>{this.props.bookmarkInfo.title}</div>
    </div>
  )
}

export default BookmarkItem
