import * as R from 'ramda'

import * as CST from '../../../constants'
import folderIcon from '../../../images/folder.svg'
import {BookmarkInfo} from '../../../types'

export const getIconUrl = (bookmarkInfo: BookmarkInfo): string => {
  if (bookmarkInfo.type === CST.BOOKMARK_TYPES.BOOKMARK)
    return `chrome://favicon/${bookmarkInfo.url}`
  if (bookmarkInfo.type === CST.BOOKMARK_TYPES.FOLDER) return folderIcon
  return ''
}

export const getType = (bookmarkNode: browser.bookmarks.BookmarkTreeNode): CST.BOOKMARK_TYPES => {
  if (bookmarkNode.url == null) return CST.BOOKMARK_TYPES.FOLDER
  if (bookmarkNode.url.startsWith(CST.SEPARATE_THIS_URL)) return CST.BOOKMARK_TYPES.SEPARATOR
  return CST.BOOKMARK_TYPES.BOOKMARK
}

export const isRoot = (bookmarkNode: browser.bookmarks.BookmarkTreeNode): boolean =>
  bookmarkNode.id === CST.ROOT_ID || bookmarkNode.parentId === CST.ROOT_ID

export const simulateBookmark = (partialBookmarkInfo: Partial<BookmarkInfo>): BookmarkInfo => ({
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
  url: ''
})

export const toBookmarkInfo = R.compose(
  (bookmarkInfo: BookmarkInfo): BookmarkInfo => ({
    ...bookmarkInfo,
    iconUrl: getIconUrl(bookmarkInfo)
  }),
  (bookmarkNode: browser.bookmarks.BookmarkTreeNode): BookmarkInfo => ({
    iconUrl: '',
    id: bookmarkNode.id,
    isRoot: isRoot(bookmarkNode),
    isSimulated: false,
    isUnmodifiable: isRoot(bookmarkNode) || Boolean(bookmarkNode.unmodifiable),
    parentId: bookmarkNode.parentId || '',
    storageIndex: typeof bookmarkNode.index === 'number' ? bookmarkNode.index : -1,
    title: bookmarkNode.title,
    type: getType(bookmarkNode),
    url: bookmarkNode.url || ''
  })
)
