import {createElement, PropTypes} from 'react'

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
    <ul
      className='menu-area'
      hidden={isHidden}
    >
      {menuAreaItems}
    </ul>
  )
}

if (process.env.NODE_ENV !== 'production') {
  MenuArea.propTypes = {
    isHidden: PropTypes.bool.isRequired,
    menuAreaKeys: PropTypes.arrayOf(PropTypes.string).isRequired
  }
}

export default MenuArea
