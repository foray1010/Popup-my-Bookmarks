import {createElement, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import {
  NAV_MODULE_CONTRIBUTORS,
  NAV_MODULE_CONTROL,
  NAV_MODULE_GENERAL,
  NAV_MODULE_USER_INTERFACE
} from '../../constants'
import NavBarItem from './NavBarItem'

import styles from '../../../../css/options/nav-bar.css'

const navBarItemInfos = [
  {
    navModule: NAV_MODULE_GENERAL,
    title: chrome.i18n.getMessage('general')
  },
  {
    navModule: NAV_MODULE_USER_INTERFACE,
    title: chrome.i18n.getMessage('userInterface')
  },
  {
    navModule: NAV_MODULE_CONTROL,
    title: chrome.i18n.getMessage('control')
  },
  {
    navModule: NAV_MODULE_CONTRIBUTORS,
    title: chrome.i18n.getMessage('contributors')
  }
]

const NavBar = (props) => {
  const {
    selectedNavModule,
    switchNavModule
  } = props

  const navItems = navBarItemInfos.map((navBarItemInfo) => {
    const {
      navModule,
      title
    } = navBarItemInfo

    return (
      <NavBarItem
        key={navModule}
        isActive={navModule === selectedNavModule}
        navModule={navModule}
        switchNavModule={switchNavModule}
        title={title}
      />
    )
  })

  return (
    <nav styleName='main'>
      {navItems}
    </nav>
  )
}

NavBar.propTypes = {
  selectedNavModule: PropTypes.string.isRequired,
  switchNavModule: PropTypes.func.isRequired
}

export default CSSModules(NavBar, styles)
