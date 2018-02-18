import {createActions} from 'reduxsauce'

export const {Creators: bookmarkCreators, Types: bookmarkTypes} = createActions({
  getSearchResult: ['searchKeyword'],
  initBookmarkTrees: null,
  openBookmarkTree: ['index', 'id'],
  refreshBookmarkTrees: null,
  removeBookmarkTrees: ['startIndex'],
  removeFocusId: null,
  setBookmarkTrees: ['bookmarkTrees'],
  setFocusId: ['focusId'],
  spliceBookmarkTrees: ['index', 'bookmarkTrees']
})
