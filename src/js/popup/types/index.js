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
  children: $ReadOnlyArray<BookmarkInfo>,
  parent: BookmarkInfo
|}

export type Bookmark = {|
  copyId: string,
  cutId: string,
  dragId: string,
  focusId: string,
  searchKeyword: string,
  trees: $ReadOnlyArray<BookmarkTree>
|}

export type MenuPattern = $ReadOnlyArray<$ReadOnlyArray<string>>

export type OpenIn = $Keys<typeof CST.OPEN_IN_TYPES>
