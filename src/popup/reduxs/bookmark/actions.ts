import { createAction } from 'typesafe-actions'

import type { BookmarkTree } from '../../types'

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

export const openBookmarkTree = createAction(
  'OPEN_BOOKMARK_TREE',
  (id: string, parentId: string) => ({ id, parentId }),
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

export const setBookmarkTrees = createAction(
  'SET_BOOKMARK_TREES',
  (bookmarkTrees: Array<BookmarkTree>) => ({ bookmarkTrees }),
)()

export const setDragIndicator = createAction(
  'SET_DRAG_INDICATOR',
  (parentId: string, index: number) => ({ parentId, index }),
)()

export const toggleBookmarkTree = createAction(
  'TOGGLE_BOOKMARK_TREE',
  (id: string, parentId: string) => ({ id, parentId }),
)()
