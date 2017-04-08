import {createElement} from 'react'
import PropTypes from 'prop-types'

import MenuItem from './MenuItem'

import '../../../../css/popup/menu-area.css'

const MenuArea = (props) => {
  const {
    isHidden,
    menuAreaKeys
  } = props

  const menuAreaItems = menuAreaKeys.map((menuItemKey) => (
    <MenuItem
      key={menuItemKey}
      menuItemKey={menuItemKey}
    />
  ))

  return (
    <ul
      styleName='main'
      hidden={isHidden}
    >
      {menuAreaItems}
    </ul>
  )
}

MenuArea.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  menuAreaKeys: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default MenuArea
