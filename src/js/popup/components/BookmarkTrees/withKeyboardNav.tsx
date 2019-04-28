import * as React from 'react'
import {connect} from 'react-redux'

import {BOOKMARK_TYPES, OPEN_IN_TYPES} from '../../constants'
import {BASE_WINDOW} from '../../constants/windows'
import {RootState, bookmarkCreators, menuCreators} from '../../reduxs'
import getLastMapKey from '../../utils/getLastMapKey'
import isMac from '../../utils/isMac'
import useKeyBindingsEvent from '../keyBindings/useKeyBindingsEvent'
import ListNavigationContext from '../listNavigation/ListNavigationContext'
import ListNavigationProvider from '../listNavigation/ListNavigationProvider'
import useKeyboardNav from '../listNavigation/useKeyboardNav'

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const mapStateToProps = (state: RootState) => ({
    trees: state.bookmark.trees
  })

  const mapDispatchToProps = {
    openBookmarksInBrowser: bookmarkCreators.openBookmarksInBrowser,
    openBookmarkTree: bookmarkCreators.openBookmarkTree,
    openMenu: menuCreators.openMenu,
    removeNextBookmarkTrees: bookmarkCreators.removeNextBookmarkTrees
  }

  type Props = P & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
  const KeyboardNav = (props: Props) => {
    const {
      openBookmarksInBrowser,
      openBookmarkTree,
      openMenu,
      removeNextBookmarkTrees,
      trees
    } = props

    const {lists} = React.useContext(ListNavigationContext)
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
      const {highlightedIndices, itemCounts} = listsRef.current

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
      onPressArrowRight: handlePressArrowRight
    })

    const handlePressEnter = React.useCallback(() => {
      const {highlightedIndices, itemCounts} = listsRef.current

      const lastListIndex = getLastMapKey(itemCounts)
      if (lastListIndex === undefined) return
      const treeInfo = trees[lastListIndex]
      if (!treeInfo) return

      // default open first bookmark in last tree
      const highlightedIndex = highlightedIndices.get(lastListIndex) || 0
      const bookmarkInfo = treeInfo.children[highlightedIndex]
      if (!bookmarkInfo) return

      openBookmarksInBrowser([bookmarkInfo.id], {
        openIn: OPEN_IN_TYPES.CURRENT_TAB,
        isAllowBookmarklet: true,
        isCloseThisExtension: true
      })
    }, [openBookmarksInBrowser, trees])

    useKeyBindingsEvent({key: 'Enter', windowId: BASE_WINDOW}, handlePressEnter)

    const handlePressContextMenu = React.useCallback(() => {
      const {highlightedIndices, itemCounts} = listsRef.current

      const lastListIndex = getLastMapKey(itemCounts)
      if (lastListIndex === undefined) return
      const treeInfo = trees[lastListIndex]
      if (!treeInfo) return

      const highlightedIndex = highlightedIndices.get(lastListIndex)
      if (highlightedIndex === undefined) return
      const bookmarkInfo = treeInfo.children[highlightedIndex]
      if (!bookmarkInfo) return

      openMenu(bookmarkInfo.id, {
        positionLeft: 0,
        positionTop: 0,
        targetLeft: 0,
        targetTop: 0
      })
    }, [openMenu, trees])

    useKeyBindingsEvent(
      {
        key: isMac() ? 'Control' : 'ContextMenu',
        windowId: BASE_WINDOW
      },
      handlePressContextMenu
    )

    return <WrappedComponent {...props} />
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
    // @ts-ignore
  )((props: Props) => (
    <ListNavigationProvider>
      <KeyboardNav {...props} />
    </ListNavigationProvider>
  ))
}
