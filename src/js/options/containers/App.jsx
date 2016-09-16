import {createElement} from 'react'
import CSSModules from 'react-css-modules'

import Donate from '../components/Donate'
import NavBar from '../components/NavBar'
import NavModuleMapper from '../components/NavModuleMapper'
import styles from '../../../css/options/app.scss'

const App = () => (
  <div>
    <NavBar />
    <NavModuleMapper />
    <Donate />
  </div>
)

export default CSSModules(App, styles)
