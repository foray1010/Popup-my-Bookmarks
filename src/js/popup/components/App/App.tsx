import '../../../../css/popup/app.css'

import * as React from 'react'

import BookmarkTrees from '../BookmarkTrees'
import Editor from '../Editor'
import KeyBindingsProvider from '../keyBindings/KeyBindingsProvider'
import Menu from '../Menu'
import Search from '../Search'

interface Props {
  isShowEditor: boolean
  isShowMenu: boolean
}
const App = (props: Props) => (
  <KeyBindingsProvider>
    <BookmarkTrees mainTreeHeader={<Search />} />
    {props.isShowEditor && <Editor />}
    {props.isShowMenu && <Menu />}
  </KeyBindingsProvider>
)

export default App
