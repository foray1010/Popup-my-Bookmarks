import PropTypes from 'prop-types'
import {createElement, PureComponent} from 'react'

import '../../../../css/popup/menu-cover.css'

class MenuCover extends PureComponent {
  handleClick = () => {
    this.props.closeMenuCover()
  }

  render() {
    const {isHidden} = this.props

    return <div styleName='main' hidden={isHidden} onClick={this.handleClick} />
  }
}

MenuCover.propTypes = {
  closeMenuCover: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired
}

export default MenuCover
