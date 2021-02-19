import * as React from 'react'
import { useSelector } from 'react-redux'

import useAction from '../../../core/hooks/useAction'
import { BOOKMARK_TYPES } from '../../constants'
import { BASE_WINDOW } from '../../constants/windows'
import type { RootState } from '../../reduxs'
import { bookmarkCreators } from '../../reduxs'
import {
  getClickOptionNameByEvent,
  mapOptionToOpenBookmarkProps,
} from '../../utils/clickBookmarkUtils'
import getLastMapKey from '../../utils/getLastMapKey'
import isMac from '../../utils/isMac'
import { useKeyBindingsEvent } from '../keyBindings'
import {
  ListNavigationProvider,
  useListNavigationContext,
} from '../listNavigation/ListNavigationContext'
import useKeyboardNav from '../listNavigation/useKeyboardNav'
import { useMenuContext } from '../menu'

export default function withKeyboardNav<P>(
  WrappedComponent: React.ComponentType<P>,
) {
  const KeyboardNav = (props: P) => {
    const options = useSelector((state: RootState) => state.options)
    const trees = useSelector((state: RootState) => state.bookmark.trees)

    const openBookmarksInBrowser = useAction(
      bookmarkCreators.openBookmarksInBrowser,
    )
    const openBookmarkTree = useAction(bookmarkCreators.openBookmarkTree)
    const removeNextBookmarkTrees = useAction(
      bookmarkCreators.removeNextBookmarkTrees,
    )

    const { open: openMenu } = useMenuContext()

    const { lists } = useListNavigationContext()
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

    useKeyBindingsEvent(
      {
        key: isMac() ? 'Control' : 'ContextMenu',
        windowId: BASE_WINDOW,
      },
      () => {
        const { highlightedIndices, itemCounts } = listsRef.current

        const lastListIndex = getLastMapKey(itemCounts)
        if (lastListIndex === undefined) return
        const treeInfo = trees[lastListIndex]
        if (!treeInfo) return

        const highlightedIndex = highlightedIndices.get(lastListIndex)
        if (highlightedIndex === undefined) return
        const bookmarkInfo = treeInfo.children[highlightedIndex]
        if (!bookmarkInfo) return

        const offset = document
          .querySelector(`[data-bookmarkid="${bookmarkInfo.id}"`)
          ?.getBoundingClientRect()
        const targetPositions = {
          top: offset?.top ?? 0,
          left: offset?.left ?? 0,
        }
        openMenu({
          targetId: bookmarkInfo.id,
          displayPositions: targetPositions,
          targetPositions,
        })
      },
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
