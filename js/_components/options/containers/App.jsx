import {element} from 'deku'

import Donate from '../components/Donate'
import NavBar from '../components/NavBar'
import NavModuleMapper from '../components/NavModuleMapper'

const App = {
  render() {
    console.log('render')

    return (
      <div id='app'>
        <NavBar />
        <NavModuleMapper />
        <Donate />
      </div>
    )
  }
}

export default App
