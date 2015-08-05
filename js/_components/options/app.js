import element from 'virtual-element'

import Donate from './donate'
import NavBar from './nav_bar'

const navBarItems = Immutable([
  {
    module: 'general',
    msg: 'opt_general'
  },
  {
    module: 'layout',
    msg: 'opt_layout'
  },
  {
    module: 'control',
    msg: 'opt_control'
  },
  {
    module: 'contributors',
    msg: 'opt_contributors'
  }
])

function afterMount({}, el, setState) {
  globals.setRootState = setState
}

function initialState(props) {
  return {
    currentModule: navBarItems[0].module,
    storage: Immutable(props.initialStorage)
  }
}

function render({state}, setState) {
  return (
    <div id='app'>
      <NavBar navBarItems={navBarItems} />
      <Donate />
    </div>
  )
}

export default {afterMount, initialState, render}
