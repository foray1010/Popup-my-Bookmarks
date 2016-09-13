import {createElement} from 'react'

import Donate from '../components/Donate'
import NavBar from '../components/NavBar'
import NavModuleMapper from '../components/NavModuleMapper'

const App = () => (
  <div id='app'>
    <NavBar />
    <NavModuleMapper />
    <Donate />
  </div>
)

export default App
