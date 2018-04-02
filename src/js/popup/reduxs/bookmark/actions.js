// @flow

import {createActions} from 'reduxsauce'

export const {Creators: bookmarkCreators, Types: bookmarkTypes} = createActions({
  addCurrentPage: ['parentId', 'index'],
  addSeparator: ['parentId', 'index'],
  arrowRightNavigate: ['id', 'parentId'],
  createBookmark: ['parentId', 'index', 'title', 'url'],
  createBookmarkAfterId: ['id', 'title', 'url'],
  copyBookmark: ['id'],
  cutBookmark: ['id'],
  deleteBookmark: ['id'],
  editBookmark: ['id', 'title', 'url'],
  getSearchResult: ['searchKeyword'],
  initBookmarkTrees: null,
  openBookmarksInBrowser: ['ids', 'openIn'],
  openBookmarkTree: ['id', 'parentId'],
  pasteBookmark: ['parentId', 'index'],
  refreshBookmarkTrees: null,
  removeBookmarkTree: ['id'],
  removeFocusId: null,
  removeNextBookmarkTrees: ['removeAfterId'],
  resetClipboard: null,
  setBookmarkTrees: ['bookmarkTrees'],
  setFocusId: ['focusId'],
  sortBookmarksByName: ['parentId']
})
