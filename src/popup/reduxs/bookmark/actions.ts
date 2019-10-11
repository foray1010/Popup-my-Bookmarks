import { createAction } from 'typesafe-actions'

import * as CST from '../../constants'
import { BookmarkTree } from '../../types'

export const addCurrentPage = createAction(
  'ADD_CURRENT_PAGE',
  action => (parentId: string, index: number) => action({ parentId, index }),
)

export const addSeparator = createAction(
  'ADD_SEPARATOR',
  action => (parentId: string, index: number) => action({ parentId, index }),
)

export const copyBookmark = createAction(
  'COPY_BOOKMARK',
  action => (id: string) => action({ id }),
)

export const createBookmark = createAction(
  'CREATE_BOOKMARK',
  action => (parentId: string, index: number, title: string, url: string) =>
    action({
      parentId,
      index,
      title,
      url,
    }),
)

export const createBookmarkAfterId = createAction(
  'CREATE_BOOKMARK_AFTER_ID',
  action => (id: string, title: string, url: string) =>
    action({
      id,
      title,
      url,
    }),
)

export const cutBookmark = createAction(
  'CUT_BOOKMARK',
  action => (id: string) => action({ id }),
)

export const deleteBookmark = createAction(
  'DELETE_BOOKMARK',
  action => (id: string) => action({ id }),
)

export const editBookmark = createAction(
  'EDIT_BOOKMARK',
  action => (id: string, title: string, url: string) =>
    action({
      id,
      title,
      url,
    }),
)

export const getSearchResult = createAction(
  'GET_SEARCH_RESULT',
  action => (searchKeyword: string) =>
    action({
      searchKeyword,
    }),
)

export const initBookmarkTrees = createAction('INIT_BOOKMARK_TREES')

export const moveBookmarkToDragIndicator = createAction(
  'MOVE_BOOKMARK_TO_DRAG_INDICATOR',
  action => (bookmarkId: string) =>
    action({
      bookmarkId,
    }),
)

export const openBookmarksInBrowser = createAction(
  'OPEN_BOOKMARKS_IN_BROWSER',
  action => (
    ids: Array<string>,
    openBookmarkProps: {
      openIn: CST.OPEN_IN_TYPES
      isAllowBookmarklet: boolean
      isCloseThisExtension: boolean
    },
  ) =>
    action({
      ids,
      openBookmarkProps,
    }),
)

export const openBookmarkTree = createAction(
  'OPEN_BOOKMARK_TREE',
  action => (id: string, parentId: string) => action({ id, parentId }),
)

export const openFolderInBrowser = createAction(
  'OPEN_FOLDER_IN_BROWSER',
  action => (
    id: string,
    openBookmarkProps: {
      openIn: CST.OPEN_IN_TYPES
      isAllowBookmarklet: boolean
      isCloseThisExtension: boolean
    },
  ) =>
    action({
      id,
      openBookmarkProps,
    }),
)

export const pasteBookmark = createAction(
  'PASTE_BOOKMARK',
  action => (parentId: string, index: number) => action({ parentId, index }),
)

export const refreshBookmarkTrees = createAction('REFRESH_BOOKMARK_TREES')

export const removeBookmarkTree = createAction(
  'REMOVE_BOOKMARK_TREE',
  action => (id: string) =>
    action({
      id,
    }),
)

export const removeDragIndicator = createAction('REMOVE_DRAG_INDICATOR')

export const removeNextBookmarkTrees = createAction(
  'REMOVE_NEXT_BOOKMARK_TREES',
  action => (removeAfterId: string) => action({ removeAfterId }),
)

export const resetClipboard = createAction('RESET_CLIPBOARD')

export const setBookmarkTrees = createAction(
  'SET_BOOKMARK_TREES',
  action => (bookmarkTrees: Array<BookmarkTree>) => action({ bookmarkTrees }),
)

export const setDragIndicator = createAction(
  'SET_DRAG_INDICATOR',
  action => (parentId: string, index: number) => action({ parentId, index }),
)

export const sortBookmarksByName = createAction(
  'SORT_BOOKMARKS_BY_NAME',
  action => (parentId: string) => action({ parentId }),
)

export const toggleBookmarkTree = createAction(
  'TOGGLE_BOOKMARK_TREE',
  action => (id: string, parentId: string) => action({ id, parentId }),
)
