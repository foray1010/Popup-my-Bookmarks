import webExtension from 'webextension-polyfill'

import { ROOT_ID } from '../../../../core/constants/index.js'
import { BOOKMARK_TYPES, NO_BOOKMARK_ID_PREFIX } from '../constants.js'
import type { BookmarkInfo, BookmarkTreeInfo } from '../types.js'
import {
  generateNoBookmarkPlaceholder,
  generateSearchResultParent,
} from '../utils/generators.js'
import sortByTitle from '../utils/sortByTitle.js'
import { toBookmarkInfo } from '../utils/transformers.js'

export async function getBookmarkInfo(id: string): Promise<BookmarkInfo> {
  if (id.startsWith(NO_BOOKMARK_ID_PREFIX)) {
    return generateNoBookmarkPlaceholder(id.replace(NO_BOOKMARK_ID_PREFIX, ''))
  }

  const [bookmarkNode] = await webExtension.bookmarks.get(id)
  if (!bookmarkNode) throw new Error('cannot get bookmark')
  return toBookmarkInfo(bookmarkNode)
}

async function getBookmarkChildren(
  id: string,
): Promise<readonly BookmarkInfo[]> {
  const bookmarkNodes = await webExtension.bookmarks.getChildren(id)
  return bookmarkNodes.map(toBookmarkInfo)
}

export async function getBookmarkTreeInfo(
  id: string,
): Promise<BookmarkTreeInfo> {
  const [parent, children] = await Promise.all([
    getBookmarkInfo(id),
    getBookmarkChildren(id),
  ])
  if (parent.type !== BOOKMARK_TYPES.FOLDER) {
    throw new TypeError('not a bookmark folder')
  }
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
}: Readonly<{
  firstTreeId: string
  hideRootTreeIds?: readonly string[]
}>): Promise<BookmarkTreeInfo> {
  const [firstTree, rootFolders] = await Promise.all([
    getBookmarkTreeInfo(firstTreeId),
    getBookmarkChildren(ROOT_ID),
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
}: Readonly<{
  firstTreeId: string
  childTreeIds?: readonly string[] | undefined
  hideRootTreeIds?: readonly string[]
}>): Promise<ReadonlyArray<BookmarkTreeInfo>> {
  const [firstTree, childTreeResults] = await Promise.all([
    getFirstBookmarkTree({ firstTreeId, hideRootTreeIds }),
    Promise.allSettled(childTreeIds.map(getBookmarkTreeInfo)),
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
): Promise<ReadonlyArray<BookmarkInfo>> {
  const searchResultNodes = await webExtension.bookmarks.search({
    query: searchQuery,
  })
  return searchResultNodes.map(toBookmarkInfo)
}
export async function getBookmarkTreesFromSearch({
  searchQuery,
  isSearchTitleOnly = false,
  maxResults = 50,
}: Readonly<{
  searchQuery: string
  isSearchTitleOnly?: boolean
  maxResults?: number
}>) {
  const searchResults = await searchBookmarks(searchQuery)

  let filteredSearchResults = searchResults.filter(
    (bookmarkInfo) => bookmarkInfo.type === BOOKMARK_TYPES.BOOKMARK,
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
  ] as const satisfies readonly BookmarkTreeInfo[]
}
