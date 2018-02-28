// @flow

import {createActions} from 'reduxsauce'

export const {Creators: bookmarkCreators, Types: bookmarkTypes} = createActions({
  addCurrentPage: ['parentId', 'index'],
  addSeparator: ['parentId', 'index'],
  copyBookmark: ['copyId'],
  cutBookmark: ['cutId'],
  deleteBookmark: ['id'],
  getSearchResult: ['searchKeyword'],
  initBookmarkTrees: null,
  openBookmarks: ['ids', 'params'],
  openBookmarkTree: ['index', 'id'],
  refreshBookmarkTrees: null,
  removeBookmarkTrees: ['startIndex'],
  removeFocusId: null,
  setBookmarkTrees: ['bookmarkTrees'],
  setFocusId: ['focusId'],
  spliceBookmarkTrees: ['index', 'bookmarkTrees']
})
