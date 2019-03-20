import debounce from 'lodash.debounce'
import * as React from 'react'

import * as CST from '../../constants'
import {bookmarkCreators} from '../../reduxs'
import {BookmarkInfo, BookmarkTree} from '../../types'
import DragAndDropContext from '../dragAndDrop/DragAndDropContext'

export default ({
  closeNextTrees,
  openBookmarkTree,
  removeFocusId,
  setFocusId,
  treeInfo
}: {
  closeNextTrees: () => void
  openBookmarkTree: typeof bookmarkCreators.openBookmarkTree
  removeFocusId: typeof bookmarkCreators.removeFocusId
  setFocusId: typeof bookmarkCreators.setFocusId
  treeInfo: BookmarkTree
}) => {
  const context = React.useContext(DragAndDropContext)

  return React.useMemo(() => {
    const _toggleBookmarkTree = (bookmarkInfo: BookmarkInfo) => {
      if (
        bookmarkInfo.type === CST.BOOKMARK_TYPES.FOLDER &&
        bookmarkInfo.id !== context.activeKey
      ) {
        openBookmarkTree(bookmarkInfo.id, treeInfo.parent.id)
      } else {
        closeNextTrees()
      }
    }
    const toggleBookmarkTree = debounce(_toggleBookmarkTree, 300)

    return {
      handleRowMouseEnter: (bookmarkInfo: BookmarkInfo) => () => {
        toggleBookmarkTree(bookmarkInfo)
        setFocusId(bookmarkInfo.id)
      },
      handleRowMouseLeave: () => {
        toggleBookmarkTree.cancel()
        removeFocusId()
      }
    }
  }, [
    closeNextTrees,
    context.activeKey,
    openBookmarkTree,
    removeFocusId,
    setFocusId,
    treeInfo.parent.id
  ])
}
