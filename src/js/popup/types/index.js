// @flow

export type BookmarkInfo = {
  id: string,
  parentId: string,
  title: string,
  url: string,
  iconUrl: string,
  storageIndex: number,
  type: string,
  isRoot: boolean,
  isUnmodifiable: boolean
}
;export type BookmarkTree = {
  children: BookmarkInfo[],
  parent: BookmarkInfo
}
;export type BookmarkTreeNode = {
  id: string,
  parentId?: string,
  index?: number,
  url?: string,
  title: string,
  dateAdded?: number,
  dateGroupModified?: number,
  unmodifiable?: string
}
;export type Bookmark = {
  copyId: string,
  cutId: string,
  dragId: string,
  focusId: string,
  searchKeyword: string,
  trees: BookmarkTree[]
};
