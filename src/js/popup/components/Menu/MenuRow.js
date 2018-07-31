// @flow strict @jsx createElement

import '../../../../css/popup/menu-item.css'

import classNames from 'classnames'
import {PureComponent, createElement} from 'react'
import webExtension from 'webextension-polyfill'

type Props = {|
  isFocused: boolean,
  isUnclickable: boolean,
  onClick: (string) => () => void,
  onMouseEnter: (string) => () => void,
  onMouseLeave: () => void,
  rowName: string
|}
class MenuRow extends PureComponent<Props> {
  handleClick = this.props.onClick(this.props.rowName)
  handleMouseEnter = this.props.onMouseEnter(this.props.rowName)

  render = () => (
    <div
      styleName={classNames('main', {
        focused: this.props.isFocused,
        unclickable: this.props.isUnclickable
      })}
      onClick={this.props.isUnclickable ? undefined : this.handleClick}
      onMouseEnter={this.handleMouseEnter}
      onMouseLeave={this.props.onMouseLeave}
    >
      {webExtension.i18n.getMessage(this.props.rowName)}
    </div>
  )
}

export default MenuRow
