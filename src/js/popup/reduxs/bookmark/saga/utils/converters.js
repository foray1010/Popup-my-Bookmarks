// @flow

import * as R from 'ramda'

import folderIcon from '../../../../../../img/folder.png'
import {ROOT_ID} from '../../../../../common/constants'
import * as CST from '../../../../constants'
import * as TYPES from '../../../../types'

const getIconUrl = (bookmarkInfo: TYPES.BookmarkInfo): string => {
  if (bookmarkInfo.type === CST.TYPE_FOLDER) return folderIcon
  if (bookmarkInfo.type === CST.TYPE_SEPARATOR) return ''
  if (bookmarkInfo.url) return `chrome://favicon/${bookmarkInfo.url}`
  return ''
}

const getType = (bookmarkTreeNode: TYPES.BookmarkTreeNode): string => {
  if (!bookmarkTreeNode.url) return CST.TYPE_FOLDER
  if (bookmarkTreeNode.url.startsWith(CST.SEPARATE_THIS_URL)) return CST.TYPE_SEPARATOR
  return CST.TYPE_BOOKMARK
}

const isRoot = (bookmarkTreeNode: TYPES.BookmarkTreeNode): boolean =>
  bookmarkTreeNode.id === ROOT_ID || bookmarkTreeNode.parentId === ROOT_ID

export const simulateBookmark = (partialBookmarkInfo: Object): TYPES.BookmarkInfo => ({
  ...partialBookmarkInfo,
  parentId: '',
  title: '',
  url: '',
  storageIndex: -1,
  isRoot: false,
  isUnmodifiable: true
})

export const toBookmark = R.compose(
  (bookmarkInfo: TYPES.BookmarkInfo): TYPES.BookmarkInfo => ({
    ...bookmarkInfo,
    iconUrl: getIconUrl(bookmarkInfo)
  }),
  (bookmarkTreeNode: TYPES.BookmarkTreeNode): TYPES.BookmarkInfo => ({
    id: bookmarkTreeNode.id,
    parentId: bookmarkTreeNode.parentId || '',
    title: bookmarkTreeNode.title,
    url: bookmarkTreeNode.url || '',
    iconUrl: '',
    storageIndex: typeof bookmarkTreeNode.index === 'number' ? bookmarkTreeNode.index : -1,
    type: getType(bookmarkTreeNode),
    isRoot: isRoot(bookmarkTreeNode),
    isUnmodifiable: isRoot(bookmarkTreeNode) || Boolean(bookmarkTreeNode.unmodifiable)
  })
)
