import {createElement, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import MenuItem from './MenuItem'

import styles from '../../../css/popup/menu-area.scss'

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

if (process.env.NODE_ENV !== 'production') {
  MenuArea.propTypes = {
    isHidden: PropTypes.bool.isRequired,
    menuAreaKeys: PropTypes.arrayOf(PropTypes.string).isRequired
  }
}

export default CSSModules(MenuArea, styles)
