// @flow
// @jsx createElement

import '../../../../css/popup/app.css'

import {Fragment, createElement} from 'react'

import BookmarkTrees from '../BookmarkTrees'
import Editor from '../Editor'
import Menu from '../Menu'
import Search from '../Search'

type Props = {|
  isShowEditor: boolean,
  isShowMenu: boolean
|}
const App = (props: Props) => (
  <Fragment>
    <BookmarkTrees mainTreeHeader={<Search />} />
    {props.isShowEditor && <Editor />}
    {props.isShowMenu && <Menu />}
  </Fragment>
)

export default App
