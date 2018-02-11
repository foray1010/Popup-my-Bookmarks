// @flow
// @jsx createElement

import '../../../../css/popup/app.css'

import {createElement} from 'react'

import BookmarkTrees from '../BookmarkTrees'
import Search from '../Search'

const App = () => <BookmarkTrees mainTreeHeader={<Search />} />

export default App
