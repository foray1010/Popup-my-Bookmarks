import {element} from 'deku'

import {
  reloadOptions,
  selectNavModule
} from '../actions'

const clickHandler = (model) => async () => {
  const {context, dispatch, props} = model

  const {navBarItemInfo} = props
  const {selectedNavModule} = context

  const newSelectedNavModule = navBarItemInfo.navModule

  if (newSelectedNavModule !== selectedNavModule) {
    dispatch([
      await reloadOptions(), // reset the options
      selectNavModule(newSelectedNavModule)
    ])
  }
}

const NavBarItem = {
  render(model) {
    const {context, props} = model

    const {navBarItemInfo} = props
    const {selectedNavModule} = context

    const navBarItemClasses = ['nav-bar-item']

    if (navBarItemInfo.navModule === selectedNavModule) {
      navBarItemClasses.push('nav-bar-item-active')
    }

    return (
      <div
        class={navBarItemClasses.join(' ')}
        onClick={clickHandler(model)}
      >
        {navBarItemInfo.title}
      </div>
    )
  }
}

export default NavBarItem
