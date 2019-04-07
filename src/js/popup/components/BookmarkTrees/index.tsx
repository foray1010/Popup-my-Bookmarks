import * as React from 'react'
import {connect} from 'react-redux'

import {RootState} from '../../reduxs'
import KeyBindingsLevelWrapper from '../keyBindings/KeyBindingsLevelWrapper'
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
    <KeyBindingsLevelWrapper level={0}>
      <BookmarkTrees {...props} />
    </KeyBindingsLevelWrapper>
  )
}

export default withBookmarkEvents(
  withDragAndDropEvents(withKeyboardNav(connect(mapStateToProps)(BookmarkTreesContainer)))
)
