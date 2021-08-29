import webExtension from 'webextension-polyfill'

import { BOOKMARK_TYPES } from '../../../constants'
import { getBookmarkInfo, getBookmarkTree } from './getBookmark'

export async function recursiveCopyBookmarks(
  id: string,
  destination: {
    parentId: string
    index: number
  },
): Promise<void> {
  const bookmarkInfo = await getBookmarkInfo(id)

  const createdBookmarkNode = await webExtension.bookmarks.create({
    ...destination,
    title: bookmarkInfo.title,
    // @TODO: directly use { url: bookmarkInfo.url }
    ...(bookmarkInfo.type !== BOOKMARK_TYPES.FOLDER
      ? { url: bookmarkInfo.url }
      : null),
  })

  if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
    const bookmarkTree = await getBookmarkTree(id)

    for (const [index, child] of bookmarkTree.children.entries()) {
      await recursiveCopyBookmarks(child.id, {
        parentId: createdBookmarkNode.id,
        index,
      })
    }
  }
}
