import webExtension from 'webextension-polyfill'

import folderIcon from '@/popup/images/folder.svg'

import {
  BOOKMARK_TYPES,
  DRAG_INDICATOR_ID,
  NO_BOOKMARK_ID_PREFIX,
  SEARCH_RESULT_ID,
} from '../constants.js'
import type { BookmarkInfo } from '../types.js'

const simulatedBookmarkInfo = {
  isRoot: false,
  isSimulated: true,
  isUnmodifiable: true,
  storageIndex: -1,
  title: '',
} as const

export function generateDragIndicator(parentId: string) {
  return {
    ...simulatedBookmarkInfo,
    id: DRAG_INDICATOR_ID,
    parentId,
    type: BOOKMARK_TYPES.DRAG_INDICATOR,
  } as const satisfies BookmarkInfo
}

export function generateNoBookmarkPlaceholder(parentId: string) {
  return {
    ...simulatedBookmarkInfo,
    id: `${NO_BOOKMARK_ID_PREFIX}${parentId}`,
    parentId,
    title: webExtension.i18n.getMessage('noBkmark'),
    type: BOOKMARK_TYPES.NO_BOOKMARK,
  } as const satisfies BookmarkInfo
}

export function generateSearchResultParent() {
  return {
    ...simulatedBookmarkInfo,
    id: SEARCH_RESULT_ID,
    type: BOOKMARK_TYPES.FOLDER,
    iconUrl: folderIcon,
  } as const satisfies BookmarkInfo
}
