// @flow strict

import classNames from 'classnames'
import * as React from 'react'

import classes from '../../../../css/options/nav-bar-item.css'

type Props = {|
  isActive: boolean,
  navModule: string,
  switchNavModule: (string) => void,
  title: string
|}
class NavBarItem extends React.PureComponent<Props> {
  handleClick = () => {
    this.props.switchNavModule(this.props.navModule)
  }

  render = () => (
    <button
      className={classNames(classes.main, {
        [classes['main-active']]: this.props.isActive
      })}
      type='button'
      onClick={this.handleClick}
    >
      {this.props.title}
    </button>
  )
}

export default NavBarItem
