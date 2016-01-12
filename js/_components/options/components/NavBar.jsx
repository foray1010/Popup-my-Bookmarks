import {element} from 'deku'

import NavBarItem from './NavBarItem'

const navBarItemInfos = [
  {
    navModule: 'general',
    title: chrome.i18n.getMessage('opt_general')
  },
  {
    navModule: 'userInterface',
    title: chrome.i18n.getMessage('opt_userInterface')
  },
  {
    navModule: 'control',
    title: chrome.i18n.getMessage('opt_control')
  },
  {
    navModule: 'contributors',
    title: chrome.i18n.getMessage('opt_contributors')
  }
]

const NavBar = {
  render() {
    const navItems = navBarItemInfos.map((navBarItemInfo) => {
      return (
        <NavBarItem
          key={navBarItemInfo.navModule}
          navBarItemInfo={navBarItemInfo}
        />
      )
    })

    return (
      <nav id='nav-bar'>
        {navItems}
      </nav>
    )
  }
}

export default NavBar
