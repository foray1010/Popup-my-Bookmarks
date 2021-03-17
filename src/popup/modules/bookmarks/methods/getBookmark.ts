import webExtension from 'webextension-polyfill'

import { NO_BOOKMARK_ID_PREFIX } from '../../../constants'
import type { BookmarkInfo, BookmarkTree } from '../../../types'
import { generateNoBookmarkPlaceholder } from '../utils/generators'
import { toBookmarkInfo } from '../utils/transformers'

export async function getBookmarkInfo(id: string): Promise<BookmarkInfo> {
  if (id.startsWith(NO_BOOKMARK_ID_PREFIX)) {
    return generateNoBookmarkPlaceholder(id.replace(NO_BOOKMARK_ID_PREFIX, ''))
  }

  const [bookmarkNode] = await webExtension.bookmarks.get(id)
  return toBookmarkInfo(bookmarkNode)
}

export async function getBookmarkChildren(id: string): Promise<BookmarkInfo[]> {
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
