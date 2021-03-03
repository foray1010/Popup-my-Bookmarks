import { createAction } from 'typesafe-actions'

import type * as CST from '../../constants'
import type { BookmarkTree } from '../../types'

export const copyBookmark = createAction('COPY_BOOKMARK', (id: string) => ({
  id,
}))()

export const cutBookmark = createAction('CUT_BOOKMARK', (id: string) => ({
  id,
}))()

export const getSearchResult = createAction(
  'GET_SEARCH_RESULT',
  (searchKeyword: string) => ({
    searchKeyword,
  }),
)()

export const initBookmarkTrees = createAction('INIT_BOOKMARK_TREES')()

export const moveBookmarkToDragIndicator = createAction(
  'MOVE_BOOKMARK_TO_DRAG_INDICATOR',
  (bookmarkId: string) => ({
    bookmarkId,
  }),
)()

export const openBookmarksInBrowser = createAction(
  'OPEN_BOOKMARKS_IN_BROWSER',
  (
    ids: Array<string>,
    openBookmarkProps: {
      openIn: CST.OPEN_IN_TYPES
      isAllowBookmarklet: boolean
      isCloseThisExtension: boolean
    },
  ) => ({
    ids,
    openBookmarkProps,
  }),
)()

export const openBookmarkTree = createAction(
  'OPEN_BOOKMARK_TREE',
  (id: string, parentId: string) => ({ id, parentId }),
)()

export const openFolderInBrowser = createAction(
  'OPEN_FOLDER_IN_BROWSER',
  (
    id: string,
    openBookmarkProps: {
      openIn: CST.OPEN_IN_TYPES
      isAllowBookmarklet: boolean
      isCloseThisExtension: boolean
    },
  ) => ({
    id,
    openBookmarkProps,
  }),
)()

export const pasteBookmark = createAction(
  'PASTE_BOOKMARK',
  (parentId: string, index: number) => ({ parentId, index }),
)()

export const refreshBookmarkTrees = createAction('REFRESH_BOOKMARK_TREES')()

export const removeBookmarkTree = createAction(
  'REMOVE_BOOKMARK_TREE',
  (id: string) => ({
    id,
  }),
)()

export const removeDragIndicator = createAction('REMOVE_DRAG_INDICATOR')()

export const removeNextBookmarkTrees = createAction(
  'REMOVE_NEXT_BOOKMARK_TREES',
  (removeAfterId: string) => ({ removeAfterId }),
)()

export const resetClipboard = createAction('RESET_CLIPBOARD')()

export const setBookmarkTrees = createAction(
  'SET_BOOKMARK_TREES',
  (bookmarkTrees: Array<BookmarkTree>) => ({ bookmarkTrees }),
)()

export const setDragIndicator = createAction(
  'SET_DRAG_INDICATOR',
  (parentId: string, index: number) => ({ parentId, index }),
)()

export const sortBookmarksByName = createAction(
  'SORT_BOOKMARKS_BY_NAME',
  (parentId: string) => ({ parentId }),
)()

export const toggleBookmarkTree = createAction(
  'TOGGLE_BOOKMARK_TREE',
  (id: string, parentId: string) => ({ id, parentId }),
)()
