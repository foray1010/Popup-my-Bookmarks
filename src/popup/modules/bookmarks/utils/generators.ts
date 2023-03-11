import webExtension from 'webextension-polyfill'

import {
  BOOKMARK_TYPES,
  DRAG_INDICATOR_ID,
  NO_BOOKMARK_ID_PREFIX,
  SEARCH_RESULT_ID,
} from '../../../constants/index.js'
import folderIcon from '../../../images/folder.svg'
import type { BookmarkInfo } from '../../../types/index.js'

const simulatedBookmarkInfo = {
  isRoot: false,
  isSimulated: true,
  isUnmodifiable: true,
  storageIndex: -1,
  title: '',
} as const

export const generateDragIndicator = (parentId: string): BookmarkInfo => {
  return {
    ...simulatedBookmarkInfo,
    id: DRAG_INDICATOR_ID,
    parentId,
    type: BOOKMARK_TYPES.DRAG_INDICATOR,
  }
}

export const generateNoBookmarkPlaceholder = (
  parentId: string,
): BookmarkInfo => {
  return {
    ...simulatedBookmarkInfo,
    id: NO_BOOKMARK_ID_PREFIX + parentId,
    parentId,
    title: webExtension.i18n.getMessage('noBkmark'),
    type: BOOKMARK_TYPES.NO_BOOKMARK,
  }
}

export const generateSearchResultParent = (): BookmarkInfo => {
  return {
    ...simulatedBookmarkInfo,
    id: SEARCH_RESULT_ID,
    type: BOOKMARK_TYPES.FOLDER,
    iconUrl: folderIcon,
  }
}
