import * as React from 'react'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/options/nav-bar.css'
import {NAV_MODULE} from '../../constants'
import NavBarItem from './NavBarItem'

const navBarItemInfos = [
  {
    navModule: NAV_MODULE.GENERAL,
    title: webExtension.i18n.getMessage('general')
  },
  {
    navModule: NAV_MODULE.USER_INTERFACE,
    title: webExtension.i18n.getMessage('userInterface')
  },
  {
    navModule: NAV_MODULE.CONTROL,
    title: webExtension.i18n.getMessage('control')
  },
  {
    navModule: NAV_MODULE.CONTRIBUTORS,
    title: webExtension.i18n.getMessage('contributors')
  }
]

interface Props {
  selectedNavModule: NAV_MODULE
  switchNavModule: (navModule: NAV_MODULE) => void
}
const NavBar = (props: Props) => (
  <nav className={classes.main}>
    {navBarItemInfos.map(({navModule, title}) => (
      <NavBarItem
        key={navModule}
        isActive={navModule === props.selectedNavModule}
        navModule={navModule}
        switchNavModule={props.switchNavModule}
        title={title}
      />
    ))}
  </nav>
)

export default NavBar
