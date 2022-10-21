import * as React from 'react'

import { BASE_WINDOW } from '../../constants/windows.js'
import { useBookmarkTrees } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import { useOptions } from '../../modules/options.js'
import { KeyBindingsWindow } from '../keyBindings/index.js'
import BookmarkTrees from './BookmarkTrees.js'
import withDragAndDropEvents from './withDragAndDropEvents.js'
import withKeyboardNav from './withKeyboardNav.js'

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
