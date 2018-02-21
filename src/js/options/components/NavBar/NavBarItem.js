// @flow
// @jsx createElement

import '../../../../css/options/nav-bar-item.css'

import classNames from 'classnames'
import {PureComponent, createElement} from 'react'

type Props = {
  isActive: boolean,
  navModule: string,
  switchNavModule: (string) => void,
  title: string
};
class NavBarItem extends PureComponent<Props> {
  handleClick = () => {
    this.props.switchNavModule(this.props.navModule)
  }

  render = () => (
    <button
      styleName={classNames('main', {
        'main-active': this.props.isActive
      })}
      type='button'
      onClick={this.handleClick}
    >
      {this.props.title}
    </button>
  )
}

export default NavBarItem
