import webExtension from 'webextension-polyfill'

import {
  BOOKMARK_TYPES,
  NO_BOOKMARK_ID_PREFIX,
  SEARCH_RESULT_ID,
} from '../../../constants/index.js'
import type { BookmarkInfo } from '../../../types/index.js'

const generateFakeBookmarkInfo = (
  partialBookmarkInfo: Partial<BookmarkInfo>,
): BookmarkInfo => ({
  id: '',
  parentId: '',
  title: '',
  type: BOOKMARK_TYPES.BOOKMARK,
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
    type: BOOKMARK_TYPES.DRAG_INDICATOR,
  })
}

export const generateNoBookmarkPlaceholder = (
  parentId: string,
): BookmarkInfo => {
  return generateFakeBookmarkInfo({
    id: NO_BOOKMARK_ID_PREFIX + parentId,
    parentId,
    title: webExtension.i18n.getMessage('noBkmark'),
    type: BOOKMARK_TYPES.NO_BOOKMARK,
  })
}

export const generateSearchResultParent = (): BookmarkInfo => {
  return generateFakeBookmarkInfo({
    id: SEARCH_RESULT_ID,
    type: BOOKMARK_TYPES.FOLDER,
  })
}
