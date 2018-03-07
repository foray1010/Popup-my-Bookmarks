// @flow

import {createActions} from 'reduxsauce'

export const {Creators: bookmarkCreators, Types: bookmarkTypes} = createActions({
  addCurrentPage: ['parentId', 'index'],
  addSeparator: ['parentId', 'index'],
  copyBookmark: ['id'],
  cutBookmark: ['id'],
  deleteBookmark: ['id'],
  getSearchResult: ['searchKeyword'],
  initBookmarkTrees: null,
  openBookmarks: ['ids', 'params'],
  openBookmarkTree: ['index', 'id'],
  pasteBookmark: ['parentId', 'index'],
  refreshBookmarkTrees: null,
  removeBookmarkTrees: ['startIndex'],
  removeFocusId: null,
  resetClipboard: null,
  setBookmarkTrees: ['bookmarkTrees'],
  setFocusId: ['focusId'],
  sortBookmarksByName: ['parentId'],
  spliceBookmarkTrees: ['index', 'bookmarkTrees']
})
