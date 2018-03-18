// @flow

import {createActions} from 'reduxsauce'

export const {Creators: bookmarkCreators, Types: bookmarkTypes} = createActions({
  addCurrentPage: ['parentId', 'index'],
  addSeparator: ['parentId', 'index'],
  copyBookmark: ['id'],
  cutBookmark: ['id'],
  deleteBookmark: ['id'],
  editBookmark: ['id', 'title', 'url'],
  getSearchResult: ['searchKeyword'],
  initBookmarkTrees: null,
  openBookmarksInBrowser: ['ids', 'params'],
  openBookmarkTree: ['id', 'parentId'],
  pasteBookmark: ['parentId', 'index'],
  refreshBookmarkTrees: null,
  removeBookmarkTrees: ['removeAfterId'],
  removeFocusId: null,
  resetClipboard: null,
  setBookmarkTrees: ['bookmarkTrees'],
  setFocusId: ['focusId'],
  sortBookmarksByName: ['parentId']
})
