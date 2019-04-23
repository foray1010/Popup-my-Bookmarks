import * as React from 'react'
import {connect} from 'react-redux'

import {BASE_WINDOW} from '../../constants/windows'
import {RootState} from '../../reduxs'
import KeyBindingsWindow from '../keyBindings/KeyBindingsWindow'
import BookmarkTrees from './BookmarkTrees'
import withBookmarkEvents from './withBookmarkEvents'
import withDragAndDropEvents from './withDragAndDropEvents'
import withKeyboardNav from './withKeyboardNav'

interface OwnProps {
  mainTreeHeader: React.ReactNode
}

const getTreeIds = (state: RootState): Array<string> =>
  state.bookmark.trees.map((tree) => tree.parent.id)

const mapStateToProps = (state: RootState) => ({
  options: state.options,
  treeIds: getTreeIds(state)
})

type Props = ReturnType<typeof mapStateToProps> & OwnProps
const BookmarkTreesContainer = (props: Props) => {
  return (
    <KeyBindingsWindow windowId={BASE_WINDOW}>
      <BookmarkTrees {...props} />
    </KeyBindingsWindow>
  )
}

export default withBookmarkEvents(
  withDragAndDropEvents(withKeyboardNav(connect(mapStateToProps)(BookmarkTreesContainer)))
)
