import * as React from 'react'
import { useSelector } from 'react-redux'

import useAction from '../../../core/hooks/useAction'
import { BOOKMARK_TYPES } from '../../constants'
import { BASE_WINDOW } from '../../constants/windows'
import type { RootState } from '../../reduxs'
import { bookmarkCreators, menuCreators } from '../../reduxs'
import {
  getClickOptionNameByEvent,
  mapOptionToOpenBookmarkProps,
} from '../../utils/clickBookmarkUtils'
import getLastMapKey from '../../utils/getLastMapKey'
import isMac from '../../utils/isMac'
import useKeyBindingsEvent from '../keyBindings/useKeyBindingsEvent'
import ListNavigationContext from '../listNavigation/ListNavigationContext'
import ListNavigationProvider from '../listNavigation/ListNavigationProvider'
import useKeyboardNav from '../listNavigation/useKeyboardNav'

export default <P,>(WrappedComponent: React.ComponentType<P>) => {
  const KeyboardNav = (props: P) => {
    const highlightedItemCoordinates = useSelector(
      (state: RootState) => state.ui.highlightedItemCoordinates,
    )
    const options = useSelector((state: RootState) => state.options)
    const trees = useSelector((state: RootState) => state.bookmark.trees)

    const openBookmarksInBrowser = useAction(
      bookmarkCreators.openBookmarksInBrowser,
    )
    const openBookmarkTree = useAction(bookmarkCreators.openBookmarkTree)
    const openMenu = useAction(menuCreators.openMenu)
    const removeNextBookmarkTrees = useAction(
      bookmarkCreators.removeNextBookmarkTrees,
    )

    const { lists } = React.useContext(ListNavigationContext)
    const listsRef = React.useRef(lists)
    listsRef.current = lists

    const handlePressArrowLeft = React.useCallback(() => {
      // at least we need one tree
      if (trees.length > 1) {
        const secondLastTree = trees[trees.length - 2]

        removeNextBookmarkTrees(secondLastTree.parent.id)
      }
    }, [removeNextBookmarkTrees, trees])

    const handlePressArrowRight = React.useCallback(() => {
      const { highlightedIndices, itemCounts } = listsRef.current

      const lastListIndex = getLastMapKey(itemCounts)
      if (lastListIndex === undefined) return
      const treeInfo = trees[lastListIndex]
      if (!treeInfo) return

      const highlightedIndex = highlightedIndices.get(lastListIndex)
      if (highlightedIndex === undefined) return
      const bookmarkInfo = treeInfo.children[highlightedIndex]
      if (!bookmarkInfo) return

      if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
        openBookmarkTree(bookmarkInfo.id, treeInfo.parent.id)
      }
    }, [openBookmarkTree, trees])

    useKeyboardNav({
      windowId: BASE_WINDOW,
      onPressArrowLeft: handlePressArrowLeft,
      onPressArrowRight: handlePressArrowRight,
    })

    useKeyBindingsEvent({ key: 'Enter', windowId: BASE_WINDOW }, (evt) => {
      const { highlightedIndices, itemCounts } = listsRef.current

      const lastListIndex = getLastMapKey(itemCounts)
      if (lastListIndex === undefined) return
      const treeInfo = trees[lastListIndex]
      if (!treeInfo) return

      // default open first bookmark in last tree
      const highlightedIndex = highlightedIndices.get(lastListIndex) ?? 0
      const bookmarkInfo = treeInfo.children[highlightedIndex]
      if (!bookmarkInfo) return

      const option = options[getClickOptionNameByEvent(evt)]
      const openBookmarkProps = mapOptionToOpenBookmarkProps(option)
      openBookmarksInBrowser([bookmarkInfo.id], {
        ...openBookmarkProps,
        isAllowBookmarklet: true,
      })
    })

    const handlePressContextMenu = React.useCallback(() => {
      const { highlightedIndices, itemCounts } = listsRef.current

      const lastListIndex = getLastMapKey(itemCounts)
      if (lastListIndex === undefined) return
      const treeInfo = trees[lastListIndex]
      if (!treeInfo) return

      const highlightedIndex = highlightedIndices.get(lastListIndex)
      if (highlightedIndex === undefined) return
      const bookmarkInfo = treeInfo.children[highlightedIndex]
      if (!bookmarkInfo) return

      openMenu(bookmarkInfo.id, highlightedItemCoordinates)
    }, [highlightedItemCoordinates, openMenu, trees])

    useKeyBindingsEvent(
      {
        key: isMac() ? 'Control' : 'ContextMenu',
        windowId: BASE_WINDOW,
      },
      handlePressContextMenu,
    )

    return <WrappedComponent {...props} />
  }

  const KeyboardNavWithProviders = (props: P) => (
    <ListNavigationProvider>
      <KeyboardNav {...props} />
    </ListNavigationProvider>
  )
  return KeyboardNavWithProviders
}
