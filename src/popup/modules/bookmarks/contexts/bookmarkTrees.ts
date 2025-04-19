import constate from 'constate'
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useDebouncedCallback } from 'use-debounce'
import webExtension from 'webextension-polyfill'

import { OPTIONS } from '@/core/constants/index.js'
import { useLatestRef } from '@/core/hooks/useLatestRef.js'

import { getLocalStorage } from '../../localStorage.js'
import { useOptions } from '../../options.js'
import { BOOKMARK_TYPES } from '../constants.js'
import {
  getBookmarkTreeInfo,
  getBookmarkTreesFromRoot,
  getBookmarkTreesFromSearch,
} from '../methods/getBookmark.js'
import type { BookmarkTreeInfo } from '../types.js'
import { generateDragIndicator } from '../utils/generators.js'

function useUtils(
  setBookmarkTrees: Dispatch<SetStateAction<readonly BookmarkTreeInfo[]>>,
) {
  const insertBookmarkTree = useCallback(
    (
      trees: readonly BookmarkTreeInfo[],
      parentId: string | undefined,
      bookmarkTree: BookmarkTreeInfo,
    ): readonly BookmarkTreeInfo[] => {
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

  const withoutDragIndicator = useCallback(
    (trees: readonly BookmarkTreeInfo[]): readonly BookmarkTreeInfo[] => {
      return trees.map((tree) => ({
        ...tree,
        children: tree.children.filter(
          (child) => child.type !== BOOKMARK_TYPES.DRAG_INDICATOR,
        ),
      }))
    },
    [],
  )

  const withoutNextBookmarkTrees = useCallback(
    (
      trees: readonly BookmarkTreeInfo[],
      removeAfterId: string,
    ): readonly BookmarkTreeInfo[] => {
      const removeAfterIndex = trees.findIndex(
        (tree) => tree.parent.id === removeAfterId,
      )
      if (removeAfterIndex < 0) return trees

      return trees.slice(0, removeAfterIndex + 1)
    },
    [],
  )

  return {
    moveBookmarkToDragIndicator: useCallback(
      (id: string) => {
        setBookmarkTrees((trees) => {
          const treeInfo = trees.find((tree: BookmarkTreeInfo) =>
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

    openBookmarkTree: useCallback(
      async (id: string, parentId: string) => {
        const bookmarkTree = await getBookmarkTreeInfo(id)

        setBookmarkTrees((trees) => {
          return insertBookmarkTree(trees, parentId, bookmarkTree)
        })
      },
      [insertBookmarkTree, setBookmarkTrees],
    ),

    removeBookmarkTree: useCallback(
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

    removeDragIndicator: useCallback(() => {
      setBookmarkTrees(withoutDragIndicator)
    }, [setBookmarkTrees, withoutDragIndicator]),

    removeNextBookmarkTrees: useCallback(
      (removeAfterId: string) => {
        setBookmarkTrees((trees) => {
          return withoutNextBookmarkTrees(trees, removeAfterId)
        })
      },
      [setBookmarkTrees, withoutNextBookmarkTrees],
    ),

    setDragIndicator: useCallback(
      (parentId: string, index: number) => {
        setBookmarkTrees((trees) => {
          return withoutDragIndicator(trees).map((tree) => {
            if (tree.parent.id === parentId) {
              const newChildren = Array.from(tree.children)
              newChildren.splice(index, 0, generateDragIndicator(parentId))
              return { ...tree, children: newChildren }
            }

            return tree
          })
        })
      },
      [setBookmarkTrees, withoutDragIndicator],
    ),

    toggleBookmarkTree: useCallback(
      async (id: string, parentId: string) => {
        const bookmarkTree = await getBookmarkTreeInfo(id)

        setBookmarkTrees((trees) => {
          const isFolderOpened = trees.some((tree) => tree.parent.id === id)

          return isFolderOpened
            ? withoutNextBookmarkTrees(trees, parentId)
            : insertBookmarkTree(trees, parentId, bookmarkTree)
        })
      },
      [insertBookmarkTree, setBookmarkTrees, withoutNextBookmarkTrees],
    ),
  }
}

function useRefreshOnBookmarkEvent({
  bookmarkTrees,
  setBookmarkTrees,
  fetchBookmarkTrees,
}: Readonly<{
  bookmarkTrees: readonly BookmarkTreeInfo[]
  setBookmarkTrees: Dispatch<SetStateAction<readonly BookmarkTreeInfo[]>>
  fetchBookmarkTrees: (
    childTreeIds?: readonly string[],
  ) => Promise<readonly BookmarkTreeInfo[]>
}>) {
  // use debounce to avoid frequent refresh, such as sort bookmarks by name
  const refresh = useDebouncedCallback(() => {
    const [, ...childTreeIds] = bookmarkTrees.map((tree) => tree.parent.id)
    fetchBookmarkTrees(childTreeIds).then(setBookmarkTrees).catch(console.error)
  }, 100)
  const refreshRef = useLatestRef(refresh)

  useEffect(() => {
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
  }, [refreshRef])
}

function useBookmarkTrees() {
  const [bookmarkTrees, setBookmarkTrees] = useState<
    readonly BookmarkTreeInfo[]
  >([])
  const [searchQuery, setSearchQuery] = useState('')

  const options = useOptions()

  const fetchBookmarkTrees = useCallback(
    async (
      childTreeIds?: readonly string[],
    ): Promise<readonly BookmarkTreeInfo[]> => {
      return searchQuery
        ? getBookmarkTreesFromSearch({
            searchQuery,
            isSearchTitleOnly: options[OPTIONS.SEARCH_TARGET] === 1,
            maxResults: options[OPTIONS.MAX_RESULTS],
          })
        : getBookmarkTreesFromRoot({
            firstTreeId: String(options[OPTIONS.DEF_EXPAND]),
            childTreeIds,
            hideRootTreeIds: options[OPTIONS.HIDE_ROOT_FOLDER].map(String),
          })
    },
    [searchQuery, options],
  )

  useEffect(() => {
    const abortController = new AbortController()

    async function run(): Promise<readonly BookmarkTreeInfo[]> {
      if (options[OPTIONS.REMEMBER_POS]) {
        const localStorage = await getLocalStorage()
        const [, ...childIds] =
          localStorage?.lastPositions.map((x) => x.id) ?? []
        return fetchBookmarkTrees(childIds)
      }

      return fetchBookmarkTrees()
    }
    run()
      .then((trees) => {
        if (abortController.signal.aborted) return

        setBookmarkTrees(trees)
      })
      .catch(console.error)

    return () => {
      abortController.abort()
    }
  }, [fetchBookmarkTrees, options])

  useRefreshOnBookmarkEvent({
    bookmarkTrees,
    setBookmarkTrees,
    fetchBookmarkTrees,
  })

  const utils = useUtils(setBookmarkTrees)

  return {
    ...utils,
    bookmarkTrees,
    setBookmarkTrees,
    searchQuery,
    setSearchQuery,
  }
}

export const [BookmarkTreesProvider, useBookmarkTreesContext] =
  constate(useBookmarkTrees)
