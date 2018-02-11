import {createActions} from 'reduxsauce'

export const {Creators: bookmarkCreators, Types: bookmarkTypes} = createActions({
  getSearchResult: ['searchKeyword'],
  initBookmarkTrees: null,
  openBookmarkTree: ['index', 'id'],
  refreshBookmarkTrees: null,
  removeBookmarkTrees: ['startIndex'],
  setBookmarkTrees: ['bookmarkTrees'],
  spliceBookmarkTrees: ['index', 'bookmarkTrees']
})
