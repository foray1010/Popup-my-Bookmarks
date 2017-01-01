import {autobind} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'
import classNames from 'classnames'
import CSSModules from 'react-css-modules'

import styles from '../../../../css/options/nav-bar-item.css'

class NavBarItem extends PureComponent {
  @autobind
  handleClick() {
    const {
      navModule,
      switchNavModule
    } = this.props

    switchNavModule(navModule)
  }

  render() {
    const {
      isActive,
      title
    } = this.props

    const thisStyleName = classNames(
      'main',
      {
        'main-active': isActive
      }
    )

    return (
      <span
        styleName={thisStyleName}
        onClick={this.handleClick}
      >
        {title}
      </span>
    )
  }
}

NavBarItem.propTypes = {
  isActive: PropTypes.bool.isRequired,
  navModule: PropTypes.string.isRequired,
  switchNavModule: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default CSSModules(NavBarItem, styles, {allowMultiple: true})
