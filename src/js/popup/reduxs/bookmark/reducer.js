// @flow

import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import * as TYPES from '../../types'
import {bookmarkTypes} from './actions'

const INITIAL_STATE: TYPES.Bookmark = Immutable({
  copyId: '',
  cutId: '',
  dragId: '',
  focusId: '',
  searchKeyword: '',
  trees: []
})

type GetSearchResultPayload = { searchKeyword: string };
const getSearchResult = (
  state: TYPES.Bookmark,
  {searchKeyword}: GetSearchResultPayload
): TYPES.Bookmark => Immutable.merge(state, {searchKeyword})

type RemoveBookmarkTreesPayload = { startIndex: number };
const removeBookmarkTrees = (
  state: TYPES.Bookmark,
  {startIndex}: RemoveBookmarkTreesPayload
): TYPES.Bookmark => Immutable.set(state, 'trees', state.trees.slice(0, startIndex))

type SetBookmarkTreesPayload = { bookmarkTrees: TYPES.BookmarkTree[] };
const setBookmarkTrees = (
  state: TYPES.Bookmark,
  {bookmarkTrees}: SetBookmarkTreesPayload
): TYPES.Bookmark => Immutable.set(state, 'trees', bookmarkTrees)

type SpliceBookmarkTreesPayload = { index: number, bookmarkTrees: TYPES.BookmarkTree[] };
const spliceBookmarkTrees = (
  state: TYPES.Bookmark,
  {index, bookmarkTrees}: SpliceBookmarkTreesPayload
): TYPES.Bookmark =>
  Immutable.set(state, 'trees', state.trees.slice(0, index).concat(bookmarkTrees))

export const bookmarkReducer = createReducer(INITIAL_STATE, {
  [bookmarkTypes.GET_SEARCH_RESULT]: getSearchResult,
  [bookmarkTypes.REMOVE_BOOKMARK_TREES]: removeBookmarkTrees,
  [bookmarkTypes.SET_BOOKMARK_TREES]: setBookmarkTrees,
  [bookmarkTypes.SPLICE_BOOKMARK_TREES]: spliceBookmarkTrees
})
