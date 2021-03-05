import type * as React from 'react'
import { useSelector } from 'react-redux'

import { BASE_WINDOW } from '../../constants/windows'
import { useOptions } from '../../modules/options'
import type { RootState } from '../../reduxs'
import { KeyBindingsWindow } from '../keyBindings'
import BookmarkTrees from './BookmarkTrees'
import useBookmarkEvents from './useBookmarkEvents'
import withDragAndDropEvents from './withDragAndDropEvents'
import withKeyboardNav from './withKeyboardNav'

const getTreeIds = (state: RootState) =>
  state.bookmark.trees.map((tree) => tree.parent.id)

interface Props {
  mainTreeHeader: React.ReactNode
}
const InnerBookmarkTreesContainer = (props: Props) => {
  useBookmarkEvents()

  const options = useOptions()
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

const BookmarkTreesContainer = withDragAndDropEvents(
  withKeyboardNav(InnerBookmarkTreesContainer),
)
export default BookmarkTreesContainer
