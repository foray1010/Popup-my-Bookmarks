import * as React from 'react'
import { useSelector } from 'react-redux'

import { BASE_WINDOW } from '../../constants/windows'
import type { RootState } from '../../reduxs'
import KeyBindingsWindow from '../keyBindings/KeyBindingsWindow'
import BookmarkTrees from './BookmarkTrees'
import useBookmarkEvents from './useBookmarkEvents'
import withDragAndDropEvents from './withDragAndDropEvents'
import withKeyboardNav from './withKeyboardNav'

const getTreeIds = (state: RootState) =>
  state.bookmark.trees.map((tree) => tree.parent.id)

interface Props {
  mainTreeHeader: React.ReactNode
}
const BookmarkTreesContainer = (props: Props) => {
  useBookmarkEvents()

  const options = useSelector((state: RootState) => state.options)
  const treeIds = useSelector(getTreeIds)

  return (
    <KeyBindingsWindow windowId={BASE_WINDOW}>
      <BookmarkTrees
        mainTreeHeader={props.mainTreeHeader}
        options={options}
        treeIds={treeIds}
      />
    </KeyBindingsWindow>
  )
}

const BookmarkTreesWithHOC = withDragAndDropEvents(
  withKeyboardNav(BookmarkTreesContainer),
)
export default BookmarkTreesWithHOC
