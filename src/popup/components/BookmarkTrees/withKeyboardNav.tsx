import type * as React from 'react'

import withProviders from '../../../core/utils/withProviders.js'
import { BOOKMARK_TYPES } from '../../constants/index.js'
import { BASE_WINDOW } from '../../constants/windows.js'
import { useBookmarkTrees } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import { openBookmarksInBrowser } from '../../modules/bookmarks/methods/openBookmark.js'
import {
  getClickOptionNameByEvent,
  mapOptionToOpenBookmarkProps,
} from '../../modules/bookmarks/utils/clickBookmark.js'
import { useOptions } from '../../modules/options.js'
import getLastMapKey from '../../utils/getLastMapKey.js'
import isMac from '../../utils/isMac.js'
import { useKeyBindingsEvent } from '../keyBindings/index.js'
import {
  ListNavigationProvider,
  useKeyboardNav,
  useListNavigationContext,
} from '../listNavigation/index.js'
import { useMenuContext } from '../menu/index.js'

const useArrowKeysNav = () => {
  const {
    bookmarkTrees: trees,
    openBookmarkTree,
    removeNextBookmarkTrees,
  } = useBookmarkTrees()

  const { listNavigation } = useListNavigationContext()

  useKeyboardNav({
    windowId: BASE_WINDOW,
    onPressArrowLeft() {
      const secondLastTree = trees.at(-2)
      if (secondLastTree) {
        removeNextBookmarkTrees(secondLastTree.parent.id)
      }
    },
    async onPressArrowRight() {
      const { highlightedIndices, itemCounts } = listNavigation

      const lastListIndex = getLastMapKey(itemCounts)
      if (lastListIndex === undefined) return
      const treeInfo = trees[lastListIndex]
      if (!treeInfo) return

      const highlightedIndex = highlightedIndices.get(lastListIndex)
      if (highlightedIndex === undefined) return
      const bookmarkInfo = treeInfo.children[highlightedIndex]
      if (!bookmarkInfo) return

      if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
        await openBookmarkTree(bookmarkInfo.id, treeInfo.parent.id)
      }
    },
  })
}

const useEnterKeyNav = () => {
  const options = useOptions()

  const { bookmarkTrees: trees } = useBookmarkTrees()

  const { listNavigation } = useListNavigationContext()

  useKeyBindingsEvent({ key: 'Enter', windowId: BASE_WINDOW }, async (evt) => {
    const { highlightedIndices, itemCounts } = listNavigation

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
    await openBookmarksInBrowser([bookmarkInfo.id], {
      ...openBookmarkProps,
      isAllowBookmarklet: true,
    })
  })
}

const useMenuKeyNav = () => {
  const { bookmarkTrees: trees } = useBookmarkTrees()

  const { open: openMenu } = useMenuContext()

  const { listNavigation } = useListNavigationContext()

  useKeyBindingsEvent(
    {
      key: isMac() ? 'Control' : 'ContextMenu',
      windowId: BASE_WINDOW,
    },
    () => {
      const { highlightedIndices, itemCounts } = listNavigation

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
}

export default function withKeyboardNav<P extends {}>(
  WrappedComponent: React.ComponentType<P>,
) {
  const InnerComponent = (props: P) => {
    useArrowKeysNav()
    useEnterKeyNav()
    useMenuKeyNav()

    return <WrappedComponent {...props} />
  }

  return withProviders<P>(InnerComponent, [ListNavigationProvider])
}
