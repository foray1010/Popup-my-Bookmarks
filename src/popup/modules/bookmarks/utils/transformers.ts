import {
  BOOKMARK_TYPES,
  ROOT_ID,
  SEPARATE_THIS_URL,
} from '../../../constants/index.js'
import folderIcon from '../../../images/folder.svg'
import type { BookmarkInfo } from '../../../types/index.js'
import { faviconUrl } from '../../../utils/faviconUrl.js'

const getIconUrl = (bookmarkInfo: BookmarkInfo): string => {
  switch (bookmarkInfo.type) {
    case BOOKMARK_TYPES.BOOKMARK:
      return faviconUrl(bookmarkInfo.url)

    case BOOKMARK_TYPES.FOLDER:
      return folderIcon

    case BOOKMARK_TYPES.DRAG_INDICATOR:
    case BOOKMARK_TYPES.NO_BOOKMARK:
    case BOOKMARK_TYPES.SEPARATOR:
      return ''
  }
}

const getType = (
  bookmarkNode: browser.bookmarks.BookmarkTreeNode,
): BOOKMARK_TYPES => {
  if (bookmarkNode.url == null) return BOOKMARK_TYPES.FOLDER
  if (bookmarkNode.url.startsWith(SEPARATE_THIS_URL)) {
    return BOOKMARK_TYPES.SEPARATOR
  }
  return BOOKMARK_TYPES.BOOKMARK
}

const isRoot = (bookmarkNode: browser.bookmarks.BookmarkTreeNode): boolean =>
  bookmarkNode.id === ROOT_ID || bookmarkNode.parentId === ROOT_ID

export const toBookmarkInfo = (
  bookmarkNode: browser.bookmarks.BookmarkTreeNode,
): BookmarkInfo => {
  const bookmarkInfo = {
    iconUrl: '',
    id: bookmarkNode.id,
    isRoot: isRoot(bookmarkNode),
    isSimulated: false,
    isUnmodifiable: isRoot(bookmarkNode) || Boolean(bookmarkNode.unmodifiable),
    parentId: bookmarkNode.parentId ?? '',
    storageIndex:
      typeof bookmarkNode.index === 'number' ? bookmarkNode.index : -1,
    title: bookmarkNode.title,
    type: getType(bookmarkNode),
    url: bookmarkNode.url ?? '',
  }

  return {
    ...bookmarkInfo,
    iconUrl: getIconUrl(bookmarkInfo),
  }
}
