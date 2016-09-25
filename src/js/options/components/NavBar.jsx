import {createElement} from 'react'
import CSSModules from 'react-css-modules'

import {
  NAV_MODULE_CONTRIBUTORS,
  NAV_MODULE_CONTROL,
  NAV_MODULE_GENERAL,
  NAV_MODULE_USER_INTERFACE
} from '../constants'
import NavBarItem from './NavBarItem'

import styles from '../../../css/options/nav-bar.css'

const navBarItemInfos = [
  {
    navModule: NAV_MODULE_GENERAL,
    title: chrome.i18n.getMessage('opt_general')
  },
  {
    navModule: NAV_MODULE_USER_INTERFACE,
    title: chrome.i18n.getMessage('opt_userInterface')
  },
  {
    navModule: NAV_MODULE_CONTROL,
    title: chrome.i18n.getMessage('opt_control')
  },
  {
    navModule: NAV_MODULE_CONTRIBUTORS,
    title: chrome.i18n.getMessage('opt_contributors')
  }
]

const NavBar = () => {
  const navItems = navBarItemInfos.map((navBarItemInfo) => (
    <NavBarItem
      key={navBarItemInfo.navModule}
      navBarItemInfo={navBarItemInfo}
    />
  ))

  return (
    <nav styleName='main'>
      {navItems}
    </nav>
  )
}

export default CSSModules(NavBar, styles)
