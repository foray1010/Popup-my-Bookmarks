import constate from 'constate'
import { produce } from 'immer'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import { BOOKMARK_TYPES, OPTIONS } from '../../../constants/index.js'
import type { BookmarkTree, LastPosition } from '../../../types/index.js'
import { useOptions } from '../../options.js'
import {
  getBookmarkTree,
  getBookmarkTreesFromRoot,
  getBookmarkTreesFromSearch,
} from '../methods/getBookmark.js'
import { generateDragIndicator } from '../utils/generators.js'

const useUtils = (
  setBookmarkTrees: React.Dispatch<
    React.SetStateAction<readonly BookmarkTree[]>
  >,
) => {
  const insertBookmarkTree = React.useCallback(
    (
      trees: readonly BookmarkTree[],
      parentId: string | undefined,
      bookmarkTree: BookmarkTree,
    ): readonly BookmarkTree[] => {
      // if tree is already in view, no need to re-render
      if (trees.some((tree) => tree.parent.id === bookmarkTree.parent.id))
        return trees

      const parentIndex = trees.findIndex((tree) => tree.parent.id === parentId)
      // if parent doesn't exist, do not show this tree in the view
      if (parentIndex < 0) return trees

      return [...trees.slice(0, parentIndex + 1), bookmarkTree]
    },
    [],
  )

  const withoutDragIndicator = React.useCallback(
    (trees: readonly BookmarkTree[]): BookmarkTree[] => {
      return trees.map((tree) => ({
        ...tree,
        children: tree.children.filter(
          (child) => child.type !== BOOKMARK_TYPES.DRAG_INDICATOR,
        ),
      }))
    },
    [],
  )

  const withoutNextBookmarkTrees = React.useCallback(
    (
      trees: readonly BookmarkTree[],
      removeAfterId: string,
    ): readonly BookmarkTree[] => {
      const removeAfterIndex = trees.findIndex(
        (tree) => tree.parent.id === removeAfterId,
      )
      if (removeAfterIndex < 0) return trees

      return trees.slice(0, removeAfterIndex + 1)
    },
    [],
  )

  return {
    moveBookmarkToDragIndicator: React.useCallback(
      (id: string) => {
        setBookmarkTrees((trees) => {
          const treeInfo = trees.find((tree: BookmarkTree) =>
            tree.children.some(
              (bookmarkInfo) =>
                bookmarkInfo.type === BOOKMARK_TYPES.DRAG_INDICATOR,
            ),
          )
          if (!treeInfo) return trees

          const { storageIndex } = treeInfo.children.reduceRight(
            (acc, bookmarkInfo) => {
              if (acc.isReduced) return acc

              if (bookmarkInfo.type === BOOKMARK_TYPES.DRAG_INDICATOR) {
                return {
                  ...acc,
                  isCapture: true,
                }
              }

              if (acc.isCapture) {
                if (!bookmarkInfo.isRoot && !bookmarkInfo.isSimulated) {
                  return {
                    isCapture: false,
                    isReduced: true,
                    storageIndex: bookmarkInfo.storageIndex + 1,
                  }
                }
              }

              return acc
            },
            {
              isCapture: false,
              isReduced: false,
              storageIndex: 0,
            },
          )

          webExtension.bookmarks
            .move(id, {
              parentId: treeInfo.parent.id,
              index: storageIndex,
            })
            .catch(console.error)

          return withoutDragIndicator(trees)
        })
      },
      [setBookmarkTrees, withoutDragIndicator],
    ),

    openBookmarkTree: React.useCallback(
      async (id: string, parentId: string) => {
        const bookmarkTree = await getBookmarkTree(id)

        setBookmarkTrees((trees) => {
          return insertBookmarkTree(trees, parentId, bookmarkTree)
        })
      },
      [insertBookmarkTree, setBookmarkTrees],
    ),

    removeBookmarkTree: React.useCallback(
      (id: string) => {
        setBookmarkTrees((trees) => {
          const removeFromIndex = trees.findIndex(
            (tree) => tree.parent.id === id,
          )
          if (removeFromIndex < 0) return trees

          return trees.slice(0, removeFromIndex)
        })
      },
      [setBookmarkTrees],
    ),

    removeDragIndicator: React.useCallback(() => {
      setBookmarkTrees(withoutDragIndicator)
    }, [setBookmarkTrees, withoutDragIndicator]),

    removeNextBookmarkTrees: React.useCallback(
      (removeAfterId: string) => {
        setBookmarkTrees((trees) => {
          return withoutNextBookmarkTrees(trees, removeAfterId)
        })
      },
      [setBookmarkTrees, withoutNextBookmarkTrees],
    ),

    setDragIndicator: React.useCallback(
      (parentId: string, index: number) => {
        setBookmarkTrees((trees) => {
          const parentIndex = trees.findIndex(
            (tree) => tree.parent.id === parentId,
          )
          if (parentIndex === -1) return trees

          return produce(withoutDragIndicator(trees), (newTrees) => {
            newTrees[parentIndex]?.children.splice(
              index,
              0,
              generateDragIndicator(parentId),
            )
          })
        })
      },
      [setBookmarkTrees, withoutDragIndicator],
    ),

    toggleBookmarkTree: React.useCallback(
      async (id: string, parentId: string) => {
        const bookmarkTree = await getBookmarkTree(id)

        setBookmarkTrees((trees) => {
          const isFolderOpened = trees.some((tree) => tree.parent.id === id)

          if (isFolderOpened) {
            return withoutNextBookmarkTrees(trees, parentId)
          } else {
            return insertBookmarkTree(trees, parentId, bookmarkTree)
          }
        })
      },
      [insertBookmarkTree, setBookmarkTrees, withoutNextBookmarkTrees],
    ),
  }
}

const useRefreshOnBookmarkEvent = (refresh: () => void) => {
  // use ref to save refresh, otherwise the listener will keep remounting when typing in search bar
  const refreshRef = React.useRef(refresh)
  refreshRef.current = refresh
  React.useEffect(() => {
    const refreshTrees = refreshRef.current

    webExtension.bookmarks.onChanged.addListener(refreshTrees)
    webExtension.bookmarks.onCreated.addListener(refreshTrees)
    webExtension.bookmarks.onMoved.addListener(refreshTrees)
    webExtension.bookmarks.onRemoved.addListener(refreshTrees)

    return () => {
      webExtension.bookmarks.onChanged.removeListener(refreshTrees)
      webExtension.bookmarks.onCreated.removeListener(refreshTrees)
      webExtension.bookmarks.onMoved.removeListener(refreshTrees)
      webExtension.bookmarks.onRemoved.removeListener(refreshTrees)
    }
  }, [])
}

const useBookmarkTreesState = () => {
  const [bookmarkTrees, setBookmarkTrees] = React.useState<
    readonly BookmarkTree[]
  >([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [, startTransition] = React.useTransition()

  const options = useOptions()

  const fetchBookmarkTrees = React.useCallback(() => {
    async function main() {
      if (searchQuery) {
        const bookmarkTrees = await getBookmarkTreesFromSearch({
          searchQuery,
          isSearchTitleOnly: options[OPTIONS.SEARCH_TARGET] === 1,
          maxResults: options[OPTIONS.MAX_RESULTS],
        })
        startTransition(() => {
          setBookmarkTrees(bookmarkTrees)
        })
      } else {
        const { lastPositions = [] } =
          (await webExtension.storage.local.get()) as {
            lastPositions?: LastPosition[]
          }
        const bookmarkTrees = await getBookmarkTreesFromRoot({
          firstTreeId: String(options[OPTIONS.DEF_EXPAND]),
          childTreeIds: options[OPTIONS.REMEMBER_POS]
            ? lastPositions.map((x) => x.id)
            : [],
          hideRootTreeIds: (options[OPTIONS.HIDE_ROOT_FOLDER] ?? []).map(
            String,
          ),
        })
        startTransition(() => {
          setBookmarkTrees(bookmarkTrees)
        })
      }
    }
    main().catch(console.error)
  }, [searchQuery, options])

  React.useEffect(fetchBookmarkTrees, [fetchBookmarkTrees])

  useRefreshOnBookmarkEvent(fetchBookmarkTrees)

  const utils = useUtils(setBookmarkTrees)

  return {
    ...utils,
    bookmarkTrees,
    setBookmarkTrees,
    searchQuery,
    setSearchQuery,
  }
}

export const [BookmarkTreesProvider, useBookmarkTrees] = constate(
  useBookmarkTreesState,
)
