import element from 'virtual-element'

import NavBarItem from './nav_bar_item'

function render({props}) {
  const navItems = props.navBarItems.asMutable().map((navBarItemInfo) => {
    return (
      <NavBarItem
        key={navBarItemInfo.module}
        currentModule={props.currentModule}
        navBarItemInfo={navBarItemInfo} />
    )
  })

  return (
    <nav id='nav-bar'>
      {navItems}
    </nav>
  )
}

export default {render}
