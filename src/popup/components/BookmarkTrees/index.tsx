import { type ReactNode, useMemo } from 'react'

import { OPTIONS } from '@/core/constants/index.js'
import { WindowId } from '@/popup/constants/windows.js'
import { useBookmarkTreesContext } from '@/popup/modules/bookmarks/contexts/bookmarkTrees.js'
import { LastPositionsProvider } from '@/popup/modules/lastPositions/index.js'
import { useOptions } from '@/popup/modules/options.js'

import { KeyBindingsWindow } from '../keyBindings/index.js'
import BookmarkTrees from './BookmarkTrees.js'
import withDragAndDropEvents from './withDragAndDropEvents.js'
import withKeyboardNav from './withKeyboardNav.js'

type Props = Readonly<{
  firstTreeHeader: ReactNode
}>
function InnerBookmarkTreesContainer(props: Props) {
  const options = useOptions()

  const { bookmarkTrees } = useBookmarkTreesContext()
  const treeIds = useMemo(
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
