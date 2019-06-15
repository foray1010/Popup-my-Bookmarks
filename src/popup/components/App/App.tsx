import * as React from 'react'

import BookmarkTrees from '../BookmarkTrees'
import Editor from '../Editor'
import Menu from '../Menu'
import Search from '../Search'
import classes from './app.css'

interface Props {
  isShowEditor: boolean
  isShowMenu: boolean
  style: React.CSSProperties
}
const App = (props: Props) => (
  <div className={classes.main} style={props.style}>
    <BookmarkTrees mainTreeHeader={<Search />} />
    {props.isShowEditor && <Editor />}
    {props.isShowMenu && <Menu />}
  </div>
)

export default App
