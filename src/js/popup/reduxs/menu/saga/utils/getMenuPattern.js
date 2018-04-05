// @flow

import * as CST from '../../../../constants'
import type {BookmarkInfo, MenuPattern} from '../../../../types'

const getBookmarkManagePattern = (bookmarkInfo, isSearching) => {
  if (bookmarkInfo.isRoot) return []

  if (isSearching) return [[CST.MENU_CUT, CST.MENU_COPY]]

  return [
    [CST.MENU_CUT, CST.MENU_COPY, CST.MENU_PASTE],
    [CST.MENU_ADD_PAGE, CST.MENU_ADD_FOLDER, CST.MENU_ADD_SEPARATOR],
    // it will be useless if no bookmark to sort
    bookmarkInfo.type === CST.TYPE_NO_BOOKMARK ? null : [CST.MENU_SORT_BY_NAME]
  ].filter(Boolean)
}

const getMutatePattern = (bookmarkInfo) => {
  if (bookmarkInfo.isUnmodifiable) return []

  return [[bookmarkInfo.type === CST.TYPE_FOLDER ? CST.MENU_RENAME : CST.MENU_EDIT, CST.MENU_DEL]]
}

const getOpenByPattern = (bookmarkInfo) => {
  switch (bookmarkInfo.type) {
    case CST.TYPE_BOOKMARK:
    case CST.TYPE_SEPARATOR:
      return [[CST.MENU_OPEN_IN_B, CST.MENU_OPEN_IN_N, CST.MENU_OPEN_IN_I]]
    case CST.TYPE_FOLDER:
      return [[CST.MENU_OPEN_ALL, CST.MENU_OPEN_ALL_IN_N, CST.MENU_OPEN_ALL_IN_I]]
    default:
      return []
  }
}

export const getMenuPattern = (bookmarkInfo: BookmarkInfo, isSearching: boolean): MenuPattern => [
  ...getOpenByPattern(bookmarkInfo),
  ...getMutatePattern(bookmarkInfo),
  ...getBookmarkManagePattern(bookmarkInfo, isSearching)
]
