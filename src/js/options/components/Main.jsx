import {createElement} from 'react'
import CSSModules from 'react-css-modules'

import Donate from './Donate'
import NavBar from './NavBar'
import NavModuleMapper from './NavModuleMapper'

import styles from '../../../css/options/app.css'

const Main = () => (
  <div styleName='main'>
    <NavBar />
    <NavModuleMapper />
    <Donate />
  </div>
)

export default CSSModules(Main, styles)
