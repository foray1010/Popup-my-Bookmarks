import PropTypes from 'prop-types'
import {createElement} from 'react'

import '../../../../css/popup/menu-cover.css'

const MenuCover = (props) => (
  <div styleName='main' hidden={props.isHidden} onClick={props.onClick} />
)

MenuCover.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

export default MenuCover
