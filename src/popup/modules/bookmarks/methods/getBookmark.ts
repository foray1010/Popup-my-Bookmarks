import webExtension from 'webextension-polyfill'

import { NO_BOOKMARK_ID_PREFIX } from '../../../constants/index.js'
import * as CST from '../../../constants/index.js'
import type { BookmarkInfo, BookmarkTree } from '../../../types/index.js'
import sortByTitle from '../../../utils/sortByTitle.js'
import {
  generateNoBookmarkPlaceholder,
  generateSearchResultParent,
} from '../utils/generators.js'
import { toBookmarkInfo } from '../utils/transformers.js'

export async function getBookmarkInfo(id: string): Promise<BookmarkInfo> {
  if (id.startsWith(NO_BOOKMARK_ID_PREFIX)) {
    return generateNoBookmarkPlaceholder(id.replace(NO_BOOKMARK_ID_PREFIX, ''))
  }

  const [bookmarkNode] = await webExtension.bookmarks.get(id)
  if (!bookmarkNode) throw new Error('cannot get bookmark')
  return toBookmarkInfo(bookmarkNode)
}

async function getBookmarkChildren(id: string): Promise<BookmarkInfo[]> {
  const bookmarkNodes = await webExtension.bookmarks.getChildren(id)
  return bookmarkNodes.map(toBookmarkInfo)
}

export async function getBookmarkTree(id: string): Promise<BookmarkTree> {
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

async function getFirstBookmarkTree({
  firstTreeId,
  hideRootTreeIds = [],
}: {
  readonly firstTreeId: string
  readonly hideRootTreeIds?: readonly string[]
}): Promise<BookmarkTree> {
  const [firstTree, rootFolders] = await Promise.all([
    getBookmarkTree(firstTreeId),
    getBookmarkChildren(CST.ROOT_ID),
  ])
  return {
    ...firstTree,
    children: [
      ...rootFolders.filter((bookmarkInfo) => {
        return !(
          bookmarkInfo.id === firstTreeId ||
          hideRootTreeIds.includes(bookmarkInfo.id)
        )
      }),
      ...firstTree.children,
    ],
  }
}
export async function getBookmarkTreesFromRoot({
  firstTreeId,
  childTreeIds = [],
  hideRootTreeIds = [],
}: {
  readonly firstTreeId: string
  readonly childTreeIds?: ReadonlyArray<string>
  readonly hideRootTreeIds?: readonly string[]
}): Promise<Array<BookmarkTree>> {
  const [firstTree, childTreeResults] = await Promise.all([
    getFirstBookmarkTree({ firstTreeId, hideRootTreeIds }),
    Promise.allSettled(childTreeIds.map(getBookmarkTree)),
  ])

  let acc = [firstTree]
  for (const childTreeResult of childTreeResults) {
    // if childTree is deleted, ignore all its children
    if (childTreeResult.status === 'rejected') break

    const childTree = childTreeResult.value
    if (
      // in case it is root folder that open from root, keep it
      !childTree.parent.isRoot &&
      // if childTree is not belong to this parent anymore, ignore all its children
      acc.at(-1)?.parent.id !== childTree.parent.parentId
    ) {
      break
    }

    acc = [...acc, childTree]
  }
  return acc
}

async function searchBookmarks(
  searchQuery: string,
): Promise<Array<BookmarkInfo>> {
  const searchResultNodes = await webExtension.bookmarks.search({
    query: searchQuery,
  })
  return searchResultNodes.map(toBookmarkInfo)
}
export async function getBookmarkTreesFromSearch({
  searchQuery,
  isSearchTitleOnly = false,
  maxResults = 50,
}: {
  readonly searchQuery: string
  readonly isSearchTitleOnly?: boolean
  readonly maxResults?: number
}) {
  const searchResults = await searchBookmarks(searchQuery)

  let filteredSearchResults = searchResults.filter(
    (bookmarkInfo) => bookmarkInfo.type === CST.BOOKMARK_TYPES.BOOKMARK,
  )
  if (isSearchTitleOnly) {
    filteredSearchResults = filteredSearchResults.filter((bookmarkInfo) => {
      const lowerCaseTitle = bookmarkInfo.title.toLowerCase()
      return searchQuery
        .toLowerCase()
        .split(' ')
        .filter(Boolean)
        .every((x) => lowerCaseTitle.includes(x))
    })
  }

  return [
    {
      children: sortByTitle(filteredSearchResults.slice(0, maxResults)),
      parent: generateSearchResultParent(),
    },
  ]
}
