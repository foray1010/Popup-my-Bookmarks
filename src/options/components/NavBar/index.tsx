import type * as React from 'react'
import webExtension from 'webextension-polyfill'

import { NAV_MODULE } from '../../constants'
import { useNavigationContext } from '../navigationContext'
import classes from './nav-bar.css'
import NavBarItem from './NavBarItem'

const navBarItemInfos = [
  {
    navModule: NAV_MODULE.GENERAL,
    title: webExtension.i18n.getMessage('general'),
  },
  {
    navModule: NAV_MODULE.USER_INTERFACE,
    title: webExtension.i18n.getMessage('userInterface'),
  },
  {
    navModule: NAV_MODULE.CONTROL,
    title: webExtension.i18n.getMessage('control'),
  },
  {
    navModule: NAV_MODULE.CONTRIBUTORS,
    title: webExtension.i18n.getMessage('contributors'),
  },
]

const NavBar = () => {
  const { selectedNavModule, switchNavModule } = useNavigationContext()

  return (
    <nav className={classes.main}>
      {navBarItemInfos.map(({ navModule, title }) => (
        <NavBarItem
          key={navModule}
          isActive={navModule === selectedNavModule}
          navModule={navModule}
          switchNavModule={switchNavModule}
          title={title}
        />
      ))}
    </nav>
  )
}

export default NavBar
