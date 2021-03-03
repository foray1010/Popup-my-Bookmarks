import { useQuery } from 'react-query'
import webExtension from 'webextension-polyfill'

import type { Options } from '../../../core/types/options'
import * as CST from '../../constants'
import type { BookmarkInfo, BookmarkTree } from '../../types'
import { queryKey } from './constants'
import { getBookmarkInfo } from './query/useGetBookmarkInfo'
import { generateNoBookmarkPlaceholder } from './utils/generators'
import { toBookmarkInfo } from './utils/transformers'

async function getBookmarkChildren(id: string): Promise<BookmarkInfo[]> {
  const bookmarkNodes = await webExtension.bookmarks.getChildren(id)
  return bookmarkNodes.map(toBookmarkInfo)
}
export function useGetBookmarkChildren(id: string) {
  return useQuery([queryKey, id], () => getBookmarkChildren(id))
}

async function getBookmarkTree(id: string): Promise<BookmarkTree> {
  const [parent, children] = await Promise.all([
    getBookmarkInfo(id),
    getBookmarkChildren(id),
  ])
  return {
    children:
      children.length > 0
        ? children
        : [generateNoBookmarkPlaceholder(parent.id)],
    parent,
  }
}
export function useGetBookmarkTree(id: string) {
  return useQuery([queryKey, id], () => getBookmarkTree(id))
}

async function getFirstBookmarkTree(
  options: Partial<Options>,
): Promise<BookmarkTree> {
  const [firstTree, rootFolders] = await Promise.all([
    getBookmarkTree(String(options[CST.OPTIONS.DEF_EXPAND])),
    getBookmarkChildren(CST.ROOT_ID),
  ])
  return {
    ...firstTree,
    children: [
      ...rootFolders.filter((bookmarkInfo) => {
        const idNumber = Number(bookmarkInfo.id)
        return !(
          idNumber === options[CST.OPTIONS.DEF_EXPAND] ||
          (options[CST.OPTIONS.HIDE_ROOT_FOLDER] ?? []).includes(idNumber)
        )
      }),
      ...firstTree.children,
    ],
  }
}
export function useGetBookmarkTreesState(
  restTreeIds: string[],
  options: Partial<Options>,
) {
  return useQuery(
    queryKey,
    async (): Promise<BookmarkTree[]> => {
      const [firstTree, restTrees] = await Promise.all([
        getFirstBookmarkTree(options),
        Promise.all(
          restTreeIds.map((id) => getBookmarkTree(id).catch(() => null)),
        ),
      ])

      const filteredRestTrees: BookmarkTree[] = []
      for (const tree of restTrees) {
        // if `tree` is deleted, ignore next trees
        if (tree === null) break

        // if `tree` is moved to another parent, stop here
        if (
          filteredRestTrees[filteredRestTrees.length - 1].parent.id !==
          tree.parent.parentId
        ) {
          break
        }

        filteredRestTrees.push(tree)
      }

      return [firstTree, ...filteredRestTrees]
    },
  )
}

export function useSearchBookmarks(query: string) {
  return useQuery(
    [queryKey, query],
    async (): Promise<BookmarkInfo[]> => {
      const bookmarkNodes = await webExtension.bookmarks.search(query)
      return bookmarkNodes.map(toBookmarkInfo)
    },
  )
}
