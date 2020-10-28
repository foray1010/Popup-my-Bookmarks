import webExtension from 'webextension-polyfill'

import * as CST from '../../../constants'
import folderIcon from '../../../images/folder.svg'
import type { BookmarkInfo } from '../../../types'

export const generateFakeBookmarkInfo = (
  partialBookmarkInfo: Partial<BookmarkInfo>,
): BookmarkInfo => ({
  id: '',
  parentId: '',
  title: '',
  type: CST.BOOKMARK_TYPES.BOOKMARK,
  ...partialBookmarkInfo,
  iconUrl: '',
  isRoot: false,
  isSimulated: true,
  isUnmodifiable: true,
  storageIndex: -1,
  url: '',
})

export const generateNoBookmarkPlaceholder = (
  parentId: string,
): BookmarkInfo => {
  return generateFakeBookmarkInfo({
    id: CST.NO_BOOKMARK_ID_PREFIX + parentId,
    parentId,
    title: webExtension.i18n.getMessage('noBkmark'),
    type: CST.BOOKMARK_TYPES.NO_BOOKMARK,
  })
}

const getIconUrl = (bookmarkInfo: BookmarkInfo): string => {
  if (bookmarkInfo.type === CST.BOOKMARK_TYPES.BOOKMARK)
    return `chrome://favicon/${bookmarkInfo.url}`
  if (bookmarkInfo.type === CST.BOOKMARK_TYPES.FOLDER) return folderIcon
  return ''
}

const getType = (
  bookmarkNode: browser.bookmarks.BookmarkTreeNode,
): CST.BOOKMARK_TYPES => {
  if (bookmarkNode.url == null) return CST.BOOKMARK_TYPES.FOLDER
  if (bookmarkNode.url.startsWith(CST.SEPARATE_THIS_URL))
    return CST.BOOKMARK_TYPES.SEPARATOR
  return CST.BOOKMARK_TYPES.BOOKMARK
}

const isRoot = (bookmarkNode: browser.bookmarks.BookmarkTreeNode): boolean =>
  bookmarkNode.id === CST.ROOT_ID || bookmarkNode.parentId === CST.ROOT_ID

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
