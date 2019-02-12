// @flow strict

import * as R from 'ramda'

import folderIcon from '../../../../../img/folder.png'
import * as CST from '../../../constants'
import type {BookmarkInfo, BookmarkNode, BookmarkType} from '../../../types'

export const getIconUrl = (bookmarkInfo: BookmarkInfo): string => {
  if (bookmarkInfo.type === CST.TYPE_BOOKMARK) return `chrome://favicon/${bookmarkInfo.url}`
  if (bookmarkInfo.type === CST.TYPE_FOLDER) return folderIcon
  return ''
}

export const getType = (bookmarkNode: BookmarkNode): BookmarkType => {
  if (bookmarkNode.url == null) return CST.TYPE_FOLDER
  if (bookmarkNode.url.startsWith(CST.SEPARATE_THIS_URL)) return CST.TYPE_SEPARATOR
  return CST.TYPE_BOOKMARK
}

export const isRoot = (bookmarkNode: BookmarkNode): boolean =>
  bookmarkNode.id === CST.ROOT_ID || bookmarkNode.parentId === CST.ROOT_ID

export const simulateBookmark = (partialBookmarkInfo: $Shape<BookmarkInfo>): BookmarkInfo => ({
  id: '',
  parentId: '',
  title: '',
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
  (bookmarkNode: BookmarkNode): BookmarkInfo => ({
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
