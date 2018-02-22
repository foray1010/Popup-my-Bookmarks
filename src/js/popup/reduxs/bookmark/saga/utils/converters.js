// @flow

import * as R from 'ramda'

import folderIcon from '../../../../../../img/folder.png'
import * as CST from '../../../../constants'
import * as TYPES from '../../../../types'

export const getIconUrl = (bookmarkInfo: TYPES.BookmarkInfo): string => {
  if (bookmarkInfo.type === CST.TYPE_BOOKMARK) return `chrome://favicon/${bookmarkInfo.url}`
  if (bookmarkInfo.type === CST.TYPE_FOLDER) return folderIcon
  return ''
}

export const getType = (BookmarkNode: TYPES.BookmarkNode): string => {
  if (!BookmarkNode.url) return CST.TYPE_FOLDER
  if (BookmarkNode.url.startsWith(CST.SEPARATE_THIS_URL)) return CST.TYPE_SEPARATOR
  return CST.TYPE_BOOKMARK
}

export const isRoot = (BookmarkNode: TYPES.BookmarkNode): boolean =>
  BookmarkNode.id === CST.ROOT_ID || BookmarkNode.parentId === CST.ROOT_ID

export const simulateBookmark = (partialBookmarkInfo: Object): TYPES.BookmarkInfo => ({
  ...partialBookmarkInfo,
  iconUrl: '',
  isRoot: false,
  isUnmodifiable: true,
  parentId: '',
  storageIndex: -1,
  title: '',
  url: ''
})

export const toBookmarkInfo = R.compose(
  // use R.merge to replace spread as bug on flow: https://github.com/facebook/flow/issues/2405
  (bookmarkInfo: TYPES.BookmarkInfo): TYPES.BookmarkInfo =>
    R.merge(bookmarkInfo, {
      iconUrl: getIconUrl(bookmarkInfo)
    }),
  (BookmarkNode: TYPES.BookmarkNode): TYPES.BookmarkInfo => ({
    iconUrl: '',
    id: BookmarkNode.id,
    isRoot: isRoot(BookmarkNode),
    isUnmodifiable: isRoot(BookmarkNode) || Boolean(BookmarkNode.unmodifiable),
    parentId: BookmarkNode.parentId || '',
    storageIndex: typeof BookmarkNode.index === 'number' ? BookmarkNode.index : -1,
    title: BookmarkNode.title,
    type: getType(BookmarkNode),
    url: BookmarkNode.url || ''
  })
)
