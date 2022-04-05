import webExtension from 'webextension-polyfill'

import * as CST from '../../../constants'
import type { BookmarkInfo } from '../../../types'

const generateFakeBookmarkInfo = (
  partialBookmarkInfo: Partial<BookmarkInfo>,
): BookmarkInfo => ({
  id: '',
  parentId: '',
  title: '',
  type: CST.BOOKMARK_TYPES.BOOKMARK,
  ...partialBookmarkInfo,
  iconUrl: '',
  isRoot: false,
  isSimulated: true,
  isUnmodifiable: true,
  storageIndex: -1,
  url: '',
})

export const generateDragIndicator = (): BookmarkInfo => {
  return generateFakeBookmarkInfo({
    type: CST.BOOKMARK_TYPES.DRAG_INDICATOR,
  })
}

export const generateNoBookmarkPlaceholder = (
  parentId: string,
): BookmarkInfo => {
  return generateFakeBookmarkInfo({
    id: CST.NO_BOOKMARK_ID_PREFIX + parentId,
    parentId,
    title: webExtension.i18n.getMessage('noBkmark'),
    type: CST.BOOKMARK_TYPES.NO_BOOKMARK,
  })
}

export const generateSearchResultParent = (): BookmarkInfo => {
  return generateFakeBookmarkInfo({
    id: CST.SEARCH_RESULT_ID,
    type: CST.BOOKMARK_TYPES.FOLDER,
  })
}
