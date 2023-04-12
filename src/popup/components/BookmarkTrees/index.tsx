import * as React from 'react'

import { OPTIONS } from '../../../core/constants/index.js'
import { WindowId } from '../../constants/windows.js'
import { useBookmarkTreesContext } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import { LastPositionsProvider } from '../../modules/lastPositions/index.js'
import { useOptions } from '../../modules/options.js'
import { KeyBindingsWindow } from '../keyBindings/index.js'
import BookmarkTrees from './BookmarkTrees.js'
import withDragAndDropEvents from './withDragAndDropEvents.js'
import withKeyboardNav from './withKeyboardNav.js'

type Props = {
  readonly firstTreeHeader: React.ReactNode
}
function InnerBookmarkTreesContainer(props: Props) {
  const options = useOptions()

  const { bookmarkTrees } = useBookmarkTreesContext()
  const treeIds = React.useMemo(
    () => bookmarkTrees.map((tree) => tree.parent.id),
    [bookmarkTrees],
  )

  return (
    <KeyBindingsWindow windowId={WindowId.Base}>
      <LastPositionsProvider isEnabled={options[OPTIONS.REMEMBER_POS]}>
        <BookmarkTrees
          firstTreeHeader={props.firstTreeHeader}
          treeIds={treeIds}
          width={options[OPTIONS.SET_WIDTH]}
        />
      </LastPositionsProvider>
    </KeyBindingsWindow>
  )
}

const BookmarkTreesContainer = withDragAndDropEvents(
  withKeyboardNav(InnerBookmarkTreesContainer),
)
export default BookmarkTreesContainer
