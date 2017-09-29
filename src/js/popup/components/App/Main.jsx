import {createElement} from 'react'

import '../../../../css/popup/app.css'
import Editor from '../Editor'
import Menu from '../Menu'
import MenuCover from '../MenuCover'
import Panel from '../Panel'

const Main = () => (
  <div>
    <Panel />
    <MenuCover />
    <Menu />
    <Editor />
  </div>
)

export default Main
