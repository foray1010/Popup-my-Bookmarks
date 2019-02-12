// @flow strict

import {createAction} from 'redux-actions'

import type {BookmarkTree, OpenIn} from '../../types'

export const bookmarkTypes = {
  ADD_CURRENT_PAGE: 'ADD_CURRENT_PAGE',
  ADD_SEPARATOR: 'ADD_SEPARATOR',
  ARROW_RIGHT_NAVIGATE: 'ARROW_RIGHT_NAVIGATE',
  COPY_BOOKMARK: 'COPY_BOOKMARK',
  CREATE_BOOKMARK: 'CREATE_BOOKMARK',
  CREATE_BOOKMARK_AFTER_ID: 'CREATE_BOOKMARK_AFTER_ID',
  CUT_BOOKMARK: 'CUT_BOOKMARK',
  DELETE_BOOKMARK: 'DELETE_BOOKMARK',
  EDIT_BOOKMARK: 'EDIT_BOOKMARK',
  GET_SEARCH_RESULT: 'GET_SEARCH_RESULT',
  INIT_BOOKMARK_TREES: 'INIT_BOOKMARK_TREES',
  MOVE_BOOKMARK_TO_DRAG_INDICATOR: 'MOVE_BOOKMARK_TO_DRAG_INDICATOR',
  OPEN_BOOKMARK_TREE: 'OPEN_BOOKMARK_TREE',
  OPEN_BOOKMARKS_IN_BROWSER: 'OPEN_BOOKMARKS_IN_BROWSER',
  PASTE_BOOKMARK: 'PASTE_BOOKMARK',
  REFRESH_BOOKMARK_TREES: 'REFRESH_BOOKMARK_TREES',
  REMOVE_BOOKMARK_TREE: 'REMOVE_BOOKMARK_TREE',
  REMOVE_DRAG_INDICATOR: 'REMOVE_DRAG_INDICATOR',
  REMOVE_FOCUS_ID: 'REMOVE_FOCUS_ID',
  REMOVE_NEXT_BOOKMARK_TREES: 'REMOVE_NEXT_BOOKMARK_TREES',
  RESET_CLIPBOARD: 'RESET_CLIPBOARD',
  SET_BOOKMARK_TREES: 'SET_BOOKMARK_TREES',
  SET_DRAG_INDICATOR: 'SET_DRAG_INDICATOR',
  SET_FOCUS_ID: 'SET_FOCUS_ID',
  SORT_BOOKMARKS_BY_NAME: 'SORT_BOOKMARKS_BY_NAME'
}

const addCurrentPage = createAction(
  bookmarkTypes.ADD_CURRENT_PAGE,
  (parentId: string, index: number) => ({parentId, index})
)

const addSeparator = createAction(
  bookmarkTypes.ADD_SEPARATOR,
  (parentId: string, index: number) => ({parentId, index})
)

const arrowRightNavigate = createAction(
  bookmarkTypes.ARROW_RIGHT_NAVIGATE,
  (id: string, parentId: string) => ({id, parentId})
)

const copyBookmark = createAction(bookmarkTypes.COPY_BOOKMARK, (id: string) => ({id}))

const createBookmark = createAction(
  bookmarkTypes.CREATE_BOOKMARK,
  (parentId: string, index: number, title: string, url: string) => ({
    parentId,
    index,
    title,
    url
  })
)

const createBookmarkAfterId = createAction(
  bookmarkTypes.CREATE_BOOKMARK_AFTER_ID,
  (id: string, title: string, url: string) => ({
    id,
    title,
    url
  })
)

const cutBookmark = createAction(bookmarkTypes.CUT_BOOKMARK, (id: string) => ({id}))

const deleteBookmark = createAction(bookmarkTypes.DELETE_BOOKMARK, (id: string) => ({id}))

const editBookmark = createAction(
  bookmarkTypes.EDIT_BOOKMARK,
  (id: string, title: string, url: string) => ({
    id,
    title,
    url
  })
)

const getSearchResult = createAction(bookmarkTypes.GET_SEARCH_RESULT, (searchKeyword: string) => ({
  searchKeyword
}))

const initBookmarkTrees = createAction(bookmarkTypes.INIT_BOOKMARK_TREES)

const moveBookmarkToDragIndicator = createAction(
  bookmarkTypes.MOVE_BOOKMARK_TO_DRAG_INDICATOR,
  (bookmarkId: string) => ({
    bookmarkId
  })
)

const openBookmarksInBrowser = createAction(
  bookmarkTypes.OPEN_BOOKMARKS_IN_BROWSER,
  (ids: Array<string>, openIn: OpenIn, isCloseBrowser: boolean) => ({
    ids,
    openIn,
    isCloseBrowser
  })
)

const openBookmarkTree = createAction(
  bookmarkTypes.OPEN_BOOKMARK_TREE,
  (id: string, parentId: string) => ({id, parentId})
)

const pasteBookmark = createAction(
  bookmarkTypes.PASTE_BOOKMARK,
  (parentId: string, index: number) => ({parentId, index})
)

const refreshBookmarkTrees = createAction(bookmarkTypes.REFRESH_BOOKMARK_TREES)

const removeBookmarkTree = createAction(bookmarkTypes.REMOVE_BOOKMARK_TREE, (id: string) => ({
  id
}))

const removeDragIndicator = createAction(bookmarkTypes.REMOVE_DRAG_INDICATOR)

const removeFocusId = createAction(bookmarkTypes.REMOVE_FOCUS_ID)

const removeNextBookmarkTrees = createAction(
  bookmarkTypes.REMOVE_NEXT_BOOKMARK_TREES,
  (removeAfterId: string) => ({removeAfterId})
)

const resetClipboard = createAction(bookmarkTypes.RESET_CLIPBOARD)

const setBookmarkTrees = createAction(
  bookmarkTypes.SET_BOOKMARK_TREES,
  (bookmarkTrees: Array<BookmarkTree>) => ({bookmarkTrees})
)

const setDragIndicator = createAction(
  bookmarkTypes.SET_DRAG_INDICATOR,
  (parentId: string, index: number) => ({parentId, index})
)

const setFocusId = createAction(bookmarkTypes.SET_FOCUS_ID, (focusId: string) => ({focusId}))

const sortBookmarksByName = createAction(
  bookmarkTypes.SORT_BOOKMARKS_BY_NAME,
  (parentId: string) => ({parentId})
)

export const bookmarkCreators = {
  addCurrentPage,
  addSeparator,
  arrowRightNavigate,
  copyBookmark,
  createBookmark,
  createBookmarkAfterId,
  cutBookmark,
  deleteBookmark,
  editBookmark,
  getSearchResult,
  initBookmarkTrees,
  moveBookmarkToDragIndicator,
  openBookmarksInBrowser,
  openBookmarkTree,
  pasteBookmark,
  refreshBookmarkTrees,
  removeBookmarkTree,
  removeDragIndicator,
  removeFocusId,
  removeNextBookmarkTrees,
  resetClipboard,
  setBookmarkTrees,
  setDragIndicator,
  setFocusId,
  sortBookmarksByName
}
