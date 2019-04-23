import debounce from 'lodash.debounce'
import * as React from 'react'

import * as CST from '../../constants'
import {bookmarkCreators} from '../../reduxs'
import {BookmarkInfo, BookmarkTree} from '../../types'
import DragAndDropContext from '../dragAndDrop/DragAndDropContext'
import ListNavigationContext from '../listNavigation/ListNavigationContext'

export default ({
  closeNextTrees,
  openBookmarkTree,
  treeIndex,
  treeInfo
}: {
  closeNextTrees: () => void
  openBookmarkTree: typeof bookmarkCreators.openBookmarkTree
  treeIndex: number
  treeInfo: BookmarkTree
}) => {
  const {activeKey} = React.useContext(DragAndDropContext)
  const {setHighlightedIndex, unsetHighlightedIndex} = React.useContext(ListNavigationContext)

  return React.useMemo(() => {
    const _toggleBookmarkTree = (bookmarkInfo: BookmarkInfo) => {
      if (bookmarkInfo.type === CST.BOOKMARK_TYPES.FOLDER && bookmarkInfo.id !== activeKey) {
        openBookmarkTree(bookmarkInfo.id, treeInfo.parent.id)
      } else {
        closeNextTrees()
      }
    }
    const toggleBookmarkTree = debounce(_toggleBookmarkTree, 300)

    return {
      handleRowMouseEnter: (bookmarkInfo: BookmarkInfo) => () => {
        toggleBookmarkTree(bookmarkInfo)

        const index = treeInfo.children.findIndex((x) => x.id === bookmarkInfo.id)
        setHighlightedIndex(treeIndex, index)
      },
      handleRowMouseLeave: (bookmarkInfo: BookmarkInfo) => () => {
        toggleBookmarkTree.cancel()

        const index = treeInfo.children.findIndex((x) => x.id === bookmarkInfo.id)
        unsetHighlightedIndex(treeIndex, index)
      }
    }
  }, [
    activeKey,
    closeNextTrees,
    openBookmarkTree,
    setHighlightedIndex,
    treeIndex,
    treeInfo.children,
    treeInfo.parent.id,
    unsetHighlightedIndex
  ])
}
