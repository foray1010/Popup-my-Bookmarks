// @flow strict

import '../../../../css/popup/app.css'

import * as React from 'react'

import BookmarkTrees from '../BookmarkTrees'
import Editor from '../Editor'
import Menu from '../Menu'
import Search from '../Search'

type Props = {|
  isShowEditor: boolean,
  isShowMenu: boolean
|}
const App = (props: Props) => (
  <>
    <BookmarkTrees mainTreeHeader={<Search />} />
    {props.isShowEditor && <Editor />}
    {props.isShowMenu && <Menu />}
  </>
)

export default App
