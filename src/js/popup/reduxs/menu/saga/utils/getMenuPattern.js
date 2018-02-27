// @flow

import * as R from 'ramda'

import * as CST from '../../../../constants'
import type {BookmarkInfo, MenuPattern} from '../../../../types'

const filterMenuPattern = (bookmarkInfo: BookmarkInfo, isSearching: boolean) => (
  menuPattern: MenuPattern
): MenuPattern => {
  if (bookmarkInfo.isRoot) return menuPattern.slice(0, 1)
  if (isSearching) return menuPattern.slice(0, 3)
  return menuPattern
}

const getMenuPatternByType = (bookmarkInfo: BookmarkInfo): MenuPattern => [
  ...(bookmarkInfo.type === CST.TYPE_FOLDER ?
    [
      [CST.MENU_OPEN_ALL, CST.MENU_OPEN_ALL_IN_N, CST.MENU_OPEN_ALL_IN_I],
      [CST.MENU_RENAME, CST.MENU_DEL]
    ] :
    [
      [CST.MENU_OPEN_IN_B, CST.MENU_OPEN_IN_N, CST.MENU_OPEN_IN_I],
      [CST.MENU_EDIT, CST.MENU_DEL]
    ]),
  [CST.MENU_CUT, CST.MENU_COPY, CST.MENU_PASTE],
  [CST.MENU_ADD_PAGE, CST.MENU_ADD_FOLDER, CST.MENU_ADD_SEPARATOR],
  [CST.MENU_SORT_BY_NAME]
]

export const getMenuPattern = (bookmarkInfo: BookmarkInfo, isSearching: boolean): MenuPattern =>
  R.compose(filterMenuPattern(bookmarkInfo, isSearching), getMenuPatternByType)(bookmarkInfo)
