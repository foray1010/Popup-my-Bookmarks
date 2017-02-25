import {autobind} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'

import '../../../../css/popup/menu-cover.css'

class MenuCover extends PureComponent {
  @autobind
  handleClick() {
    this.props.closeMenuCover()
  }

  render() {
    const {isHidden} = this.props

    return (
      <div
        styleName='main'
        hidden={isHidden}
        onClick={this.handleClick}
      />
    )
  }
}

MenuCover.propTypes = {
  closeMenuCover: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired
}

export default MenuCover
