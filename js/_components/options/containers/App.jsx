import element from 'virtual-element'

import Donate from '../components/Donate'
import NavBar from '../components/NavBar'
import ModuleMapper from '../components/ModuleMapper'

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

async function afterMount({}, el, setState) {
  globals.setRootState = setState

  const currentModule = Object.keys(globals.optionTableMap)[0]

  const options = await globals.getCurrentModuleOptions(currentModule)

  setState({
    currentModule: currentModule,
    options: Immutable(options)
  })
}

function render({state}) {
  return (
    <div id='app'>
      <NavBar
        currentModule={state.currentModule}
        navBarItems={navBarItems}
      />
      <ModuleMapper
        currentModule={state.currentModule}
        options={state.options}
      />
      <Donate />
    </div>
  )
}

export default {afterMount, render}
