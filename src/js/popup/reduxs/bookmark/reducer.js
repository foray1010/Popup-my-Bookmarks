// @flow

import * as R from 'ramda'
import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import type {BookmarkTree} from '../../types'
import {bookmarkTypes} from './actions'

type BookmarkState = {|
  clipboard: {|
    id: string,
    isRemoveAfterPaste: boolean
  |},
  dragId: string,
  focusId: string,
  searchKeyword: string,
  trees: $ReadOnlyArray<BookmarkTree>
|}

const INITIAL_STATE: BookmarkState = Immutable({
  clipboard: {
    id: '',
    isRemoveAfterPaste: false
  },
  dragId: '',
  focusId: '',
  searchKeyword: '',
  trees: []
})

type CopyBookmarkPayload = {| id: string |}
const copyBookmark = (state: BookmarkState, {id}: CopyBookmarkPayload) =>
  Immutable.set(state, 'clipboard', {
    id,
    isRemoveAfterPaste: false
  })

type CutBookmarkPayload = {| id: string |}
const cutBookmark = (state: BookmarkState, {id}: CutBookmarkPayload) =>
  Immutable.set(state, 'clipboard', {
    id,
    isRemoveAfterPaste: true
  })

type GetSearchResultPayload = {|
  searchKeyword: string
|}
const getSearchResult = (state: BookmarkState, {searchKeyword}: GetSearchResultPayload) =>
  Immutable.merge(state, {searchKeyword})

type RemoveBookmarkTreesPayload = {|
  removeAfterId: string
|}
const removeBookmarkTrees = (
  state: BookmarkState,
  {removeAfterId}: RemoveBookmarkTreesPayload
) => {
  const removeAfterIndex = state.trees.findIndex(R.pathEq(['parent', 'id'], removeAfterId))
  if (removeAfterIndex < 0) return state

  return Immutable.set(state, 'trees', state.trees.slice(0, removeAfterIndex + 1))
}

const removeFocusId = (state: BookmarkState) => Immutable.set(state, 'focusId', '')

const resetClipboard = (state: BookmarkState) =>
  Immutable.set(state, 'clipboard', INITIAL_STATE.clipboard)

type SetBookmarkTreesPayload = {|
  bookmarkTrees: $ReadOnlyArray<BookmarkTree>
|}
const setBookmarkTrees = (state: BookmarkState, {bookmarkTrees}: SetBookmarkTreesPayload) =>
  Immutable.set(state, 'trees', bookmarkTrees)

type SetFocusIdPayload = {|
  focusId: string
|}
const setFocusId = (state: BookmarkState, {focusId}: SetFocusIdPayload) =>
  Immutable.merge(state, {focusId})

export const bookmarkReducer = createReducer(INITIAL_STATE, {
  [bookmarkTypes.COPY_BOOKMARK]: copyBookmark,
  [bookmarkTypes.CUT_BOOKMARK]: cutBookmark,
  [bookmarkTypes.GET_SEARCH_RESULT]: getSearchResult,
  [bookmarkTypes.REMOVE_BOOKMARK_TREES]: removeBookmarkTrees,
  [bookmarkTypes.REMOVE_FOCUS_ID]: removeFocusId,
  [bookmarkTypes.RESET_CLIPBOARD]: resetClipboard,
  [bookmarkTypes.SET_BOOKMARK_TREES]: setBookmarkTrees,
  [bookmarkTypes.SET_FOCUS_ID]: setFocusId
})
