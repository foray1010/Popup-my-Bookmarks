import type { ComponentType } from 'react'

import isMac from '@/core/utils/isMac.js'
import withProviders from '@/core/utils/withProviders.js'
import { WindowId } from '@/popup/constants/windows.js'
import { BOOKMARK_TYPES } from '@/popup/modules/bookmarks/constants.js'
import { useBookmarkTreesContext } from '@/popup/modules/bookmarks/contexts/bookmarkTrees.js'
import { openBookmarksInBrowser } from '@/popup/modules/bookmarks/methods/openBookmark.js'
import {
  getClickOptionNameByEvent,
  mapOptionToOpenBookmarkProps,
} from '@/popup/modules/bookmarks/utils/clickBookmark.js'
import { useOptions } from '@/popup/modules/options.js'
import getLastMapKey from '@/popup/utils/getLastMapKey.js'

import { useKeyBindingsEvent } from '../keyBindings/index.js'
import {
  ListNavigationProvider,
  useKeyboardNav,
  useListNavigationContext,
} from '../listNavigation/index.js'
import { useMenuContext } from '../menu/index.js'

function useArrowKeysNav() {
  const {
    bookmarkTrees: trees,
    openBookmarkTree,
    removeNextBookmarkTrees,
  } = useBookmarkTreesContext()

  const { listNavigation } = useListNavigationContext()

  useKeyboardNav({
    windowId: WindowId.Base,
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

function useEnterKeyNav() {
  const options = useOptions()

  const { bookmarkTrees: trees } = useBookmarkTreesContext()

  const { listNavigation } = useListNavigationContext()

  useKeyBindingsEvent(
    { key: 'Enter', windowId: WindowId.Base },
    async (evt) => {
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
    },
  )
}

function useMenuKeyNav() {
  const { bookmarkTrees: trees } = useBookmarkTreesContext()

  const { open: openMenu } = useMenuContext()

  const { listNavigation } = useListNavigationContext()

  useKeyBindingsEvent(
    {
      key: isMac() ? 'Control' : 'ContextMenu',
      windowId: WindowId.Base,
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
  WrappedComponent: ComponentType<P>,
) {
  function InnerComponent(props: P) {
    useArrowKeysNav()
    useEnterKeyNav()
    useMenuKeyNav()

    return <WrappedComponent {...props} />
  }

  return withProviders(InnerComponent, [ListNavigationProvider])
}
