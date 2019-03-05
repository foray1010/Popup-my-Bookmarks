import * as CST from '../constants'

export interface BookmarkInfo {
  iconUrl: string
  id: string
  isRoot: boolean
  isSimulated: boolean
  isUnmodifiable: boolean
  parentId: string
  storageIndex: number
  title: string
  type: CST.BOOKMARK_TYPES
  url: string
}

export interface BookmarkNode {
  dateAdded?: number
  dateGroupModified?: number
  id: string
  index?: number
  parentId?: string
  title: string
  unmodifiable?: string
  url?: string
}

export interface BookmarkTree {
  children: Array<BookmarkInfo>
  parent: BookmarkInfo
}

export interface Bookmark {
  copyId: string
  cutId: string
  dragId: string
  focusId: string
  searchKeyword: string
  trees: Array<BookmarkTree>
}

export type MenuPattern = Array<Array<string>>
