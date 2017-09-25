import {createElement, PureComponent} from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import '../../../../css/options/nav-bar-item.css'

class NavBarItem extends PureComponent {
  handleClick = () => {
    const {navModule, switchNavModule} = this.props

    switchNavModule(navModule)
  }

  render() {
    const {isActive, title} = this.props

    const thisStyleName = classNames('main', {
      'main-active': isActive
    })

    return (
      <button styleName={thisStyleName} type='button' onClick={this.handleClick}>
        {title}
      </button>
    )
  }
}

NavBarItem.propTypes = {
  isActive: PropTypes.bool.isRequired,
  navModule: PropTypes.string.isRequired,
  switchNavModule: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default NavBarItem
