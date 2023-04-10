import webExtension from 'webextension-polyfill'

import { BOOKMARK_TYPES } from '../constants.js'
import { getBookmarkInfo, getBookmarkTreeInfo } from './getBookmark.js'

export async function recursiveCopyBookmarks(
  id: string,
  destination: {
    readonly parentId: string | undefined
    readonly index: number
  },
): Promise<void> {
  const bookmarkInfo = await getBookmarkInfo(id)

  const createdBookmarkNode = await webExtension.bookmarks.create({
    ...destination,
    title: bookmarkInfo.title,
    url: bookmarkInfo.url,
  })

  if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
    const bookmarkTree = await getBookmarkTreeInfo(id)

    for (const [index, child] of bookmarkTree.children.entries()) {
      await recursiveCopyBookmarks(child.id, {
        parentId: createdBookmarkNode.id,
        index,
      })
    }
  }
}
