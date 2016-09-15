import {createElement} from 'react'

import Donate from '../components/Donate'
import NavBar from '../components/NavBar'
import NavModuleMapper from '../components/NavModuleMapper'

const App = () => (
  <div>
    <NavBar />
    <NavModuleMapper />
    <Donate />
  </div>
)

export default App
