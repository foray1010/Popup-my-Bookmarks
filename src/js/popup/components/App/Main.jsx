import {createElement} from 'react'
import CSSModules from 'react-css-modules'

import Editor from '../Editor'
import Menu from '../Menu'
import MenuCover from '../MenuCover'
import Panel from '../Panel'

import styles from '../../../../css/popup/app.css'

const Main = () => (
  <div
    styleName='main'
  >
    <Panel />
    <MenuCover />
    <Menu />
    <Editor />
  </div>
)

export default CSSModules(Main, styles)
