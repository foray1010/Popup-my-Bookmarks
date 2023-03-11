import { BOOKMARK_TYPES } from '../../constants/index.js'
import type { BookmarkInfo } from '../../types/index.js'
import { MenuItem } from './constants.js'
import type { MenuPattern } from './types.js'

const getBookmarkManagePattern = (
  bookmarkInfo: BookmarkInfo,
  isSearching: boolean,
): MenuPattern => {
  if (bookmarkInfo.isRoot) return []

  if (isSearching) return [[MenuItem.Cut, MenuItem.Copy]]

  const copySelfPattern = bookmarkInfo.isSimulated
    ? []
    : [MenuItem.Cut, MenuItem.Copy]
  return [
    [...copySelfPattern, MenuItem.Paste],
    [MenuItem.AddPage, MenuItem.AddFolder, MenuItem.AddSeparator],
    // it will be useless if no bookmark to sort
    bookmarkInfo.type === BOOKMARK_TYPES.NO_BOOKMARK
      ? []
      : [MenuItem.SortByName],
  ].filter((x) => x.length)
}

const getMutatePattern = (bookmarkInfo: BookmarkInfo): MenuPattern => {
  if (bookmarkInfo.isSimulated || bookmarkInfo.isUnmodifiable) return []

  return [
    [
      bookmarkInfo.type === BOOKMARK_TYPES.FOLDER
        ? MenuItem.Rename
        : MenuItem.Edit,
      MenuItem.Delete,
    ],
  ]
}

const getOpenByPattern = (bookmarkInfo: BookmarkInfo): MenuPattern => {
  if (bookmarkInfo.isSimulated) return []

  if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
    return [
      [
        MenuItem.OpenAll,
        MenuItem.OpenAllInNewWindow,
        MenuItem.OpenAllInIncognitoWindow,
      ],
    ]
  }

  return [
    [
      MenuItem.OpenInBackgroundTab,
      MenuItem.OpenInNewWindow,
      MenuItem.OpenInIncognitoWindow,
    ],
  ]
}

export const getMenuPattern = (
  bookmarkInfo: BookmarkInfo,
  isSearching: boolean,
): MenuPattern => [
  ...getOpenByPattern(bookmarkInfo),
  ...getMutatePattern(bookmarkInfo),
  ...getBookmarkManagePattern(bookmarkInfo, isSearching),
]
