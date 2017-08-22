import {createElement} from 'react'
import PropTypes from 'prop-types'

import MenuItem from './MenuItem'

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
    <div hidden={isHidden}>
      {menuAreaItems}
    </div>
  )
}

MenuArea.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  menuAreaKeys: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default MenuArea
