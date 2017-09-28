import {createElement} from 'react'

import Editor from '../Editor'
import Menu from '../Menu'
import MenuCover from '../MenuCover'
import Panel from '../Panel'

import '../../../../css/popup/app.css'

const Main = () => (
  <div>
    <Panel />
    <MenuCover />
    <Menu />
    <Editor />
  </div>
)

export default Main
