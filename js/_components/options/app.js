import element from 'virtual-element'

import Donate from './donate'
import NavBar from './nav_bar'
import ModuleMapper from './module_mapper'

const navBarItems = Immutable([
  {
    module: 'general',
    msg: 'opt_general'
  },
  {
    module: 'userInterface',
    msg: 'opt_userInterface'
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
    currentModule: props.initialCurrentModule,
    options: Immutable(props.initialOptions)
  }
}

function render({state}) {
  return (
    <div id='app'>
      <NavBar
        currentModule={state.currentModule}
        navBarItems={navBarItems} />
      <ModuleMapper
        currentModule={state.currentModule}
        options={state.options} />
      <Donate />
    </div>
  )
}

export default {afterMount, initialState, render}
