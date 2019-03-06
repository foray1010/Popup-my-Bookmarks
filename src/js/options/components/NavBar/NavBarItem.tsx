import classNames from 'classnames'
import * as React from 'react'

import classes from '../../../../css/options/nav-bar-item.css'
import {NAV_MODULE} from '../../constants'

interface Props {
  isActive: boolean
  navModule: NAV_MODULE
  switchNavModule: (navModule: NAV_MODULE) => void
  title: string
}
class NavBarItem extends React.PureComponent<Props> {
  private handleClick = () => {
    this.props.switchNavModule(this.props.navModule)
  }

  public render = () => (
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
