import * as React from 'react'

import { BASE_WINDOW } from '../../constants/windows'
import { useBookmarkTrees } from '../../modules/bookmarks/contexts/bookmarkTrees'
import { useOptions } from '../../modules/options'
import { KeyBindingsWindow } from '../keyBindings'
import BookmarkTrees from './BookmarkTrees'
import withDragAndDropEvents from './withDragAndDropEvents'
import withKeyboardNav from './withKeyboardNav'

interface Props {
  readonly mainTreeHeader: React.ReactNode
}
const InnerBookmarkTreesContainer = (props: Props) => {
  const { bookmarkTrees } = useBookmarkTrees()

  const options = useOptions()
  const treeIds = React.useMemo(
    () => bookmarkTrees.map((tree) => tree.parent.id),
    [bookmarkTrees],
  )

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
