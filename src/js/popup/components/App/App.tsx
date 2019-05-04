import * as React from 'react'

import classes from '../../../../css/popup/app.css'
import BookmarkTrees from '../BookmarkTrees'
import Editor from '../Editor'
import Menu from '../Menu'
import Search from '../Search'

interface Props {
  isShowEditor: boolean
  isShowMenu: boolean
  style: React.CSSProperties
}
const App = (props: Props) => (
  <main className={classes.main} style={props.style}>
    <BookmarkTrees mainTreeHeader={<Search />} />
    {props.isShowEditor && <Editor />}
    {props.isShowMenu && <Menu />}
  </main>
)

export default App
