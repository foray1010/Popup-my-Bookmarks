import classNames from 'classnames'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/popup/menu-item.css'

interface Props {
  isFocused: boolean
  isUnclickable: boolean
  onClick: (rowName: string) => () => void
  onMouseEnter: (rowName: string) => () => void
  onMouseLeave: () => void
  rowName: string
}
class MenuRow extends React.PureComponent<Props> {
  private handleClick = this.props.onClick(this.props.rowName)
  private handleMouseEnter = this.props.onMouseEnter(this.props.rowName)

  public render = () => (
    <div
      className={classNames(classes.main, {
        [classes.focused]: this.props.isFocused,
        [classes.unclickable]: this.props.isUnclickable
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
