import '../../../../css/popup/app.css'

import {Fragment, createElement} from 'react'

import Editor from '../Editor'
import Menu from '../Menu'
import MenuCover from '../MenuCover'
import Panel from '../Panel'

const App = () => (
  <Fragment>
    <Panel />
    <MenuCover />
    <Menu />
    <Editor />
  </Fragment>
)

export default App
