import type * as CST from '../constants'

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

export interface BookmarkTree {
  children: Array<BookmarkInfo>
  parent: BookmarkInfo
}

export type MenuPattern = Array<Array<string>>
