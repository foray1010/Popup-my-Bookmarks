// @flow strict

import * as CST from '../constants'

export type BookmarkInfo = {|
  iconUrl: string,
  id: string,
  isRoot: boolean,
  isSimulated: boolean,
  isUnmodifiable: boolean,
  parentId: string,
  storageIndex: number,
  title: string,
  type: string,
  url: string
|}

export type BookmarkNode = {|
  dateAdded?: number,
  dateGroupModified?: number,
  id: string,
  index?: number,
  parentId?: string,
  title: string,
  unmodifiable?: string,
  url?: string
|}

export type BookmarkTree = {|
  children: Array<BookmarkInfo>,
  parent: BookmarkInfo
|}

export type Bookmark = {|
  copyId: string,
  cutId: string,
  dragId: string,
  focusId: string,
  searchKeyword: string,
  trees: Array<BookmarkTree>
|}

export type MenuPattern = Array<Array<string>>

export type OpenIn = $Keys<typeof CST.OPEN_IN_TYPES>
