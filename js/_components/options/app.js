import {element} from 'deku'

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

function initialState(props) {
  return {
    currentModule: navBarItems[0].module,
    storage: props.storage
  }
}

function render({props, state}, setState) {
  globals.setRootState = setState

  return (
    <div id='app'>
      <NavBar navBarItems={navBarItems} />
      <Donate />
    </div>
  )
}

export default {initialState, render}
