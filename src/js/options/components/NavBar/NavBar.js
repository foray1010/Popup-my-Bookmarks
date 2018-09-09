// @flow strict @jsx createElement

import {createElement} from 'react'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/options/nav-bar.css'
import {
  NAV_MODULE_CONTRIBUTORS,
  NAV_MODULE_CONTROL,
  NAV_MODULE_GENERAL,
  NAV_MODULE_USER_INTERFACE
} from '../../constants'
import NavBarItem from './NavBarItem'

const navBarItemInfos = [
  {
    navModule: NAV_MODULE_GENERAL,
    title: webExtension.i18n.getMessage('general')
  },
  {
    navModule: NAV_MODULE_USER_INTERFACE,
    title: webExtension.i18n.getMessage('userInterface')
  },
  {
    navModule: NAV_MODULE_CONTROL,
    title: webExtension.i18n.getMessage('control')
  },
  {
    navModule: NAV_MODULE_CONTRIBUTORS,
    title: webExtension.i18n.getMessage('contributors')
  }
]

type Props = {|
  selectedNavModule: string,
  switchNavModule: (string) => void
|}
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
