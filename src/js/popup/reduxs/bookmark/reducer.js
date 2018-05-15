// @flow strict

import * as R from 'ramda'
import {handleActions} from 'redux-actions'
import type {ActionType} from 'redux-actions'

import type {BookmarkTree} from '../../types'
import {bookmarkCreators, bookmarkTypes} from './actions'

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
const INITIAL_STATE: BookmarkState = {
  clipboard: {
    id: '',
    isRemoveAfterPaste: false
  },
  dragId: '',
  focusId: '',
  searchKeyword: '',
  trees: []
}

const copyBookmark = (state, {payload}: ActionType<typeof bookmarkCreators.copyBookmark>) => ({
  ...state,
  clipboard: {
    id: payload.id,
    isRemoveAfterPaste: false
  }
})

const cutBookmark = (state, {payload}: ActionType<typeof bookmarkCreators.cutBookmark>) => ({
  ...state,
  clipboard: {
    id: payload.id,
    isRemoveAfterPaste: true
  }
})

const getSearchResult = (
  state,
  {payload}: ActionType<typeof bookmarkCreators.getSearchResult>
) => ({
  ...state,
  searchKeyword: payload.searchKeyword
})

const removeBookmarkTree = (
  state,
  {payload}: ActionType<typeof bookmarkCreators.removeBookmarkTree>
) => {
  const removeFromIndex = state.trees.findIndex(R.pathEq(['parent', 'id'], payload.id))
  if (removeFromIndex < 0) return state

  return {
    ...state,
    trees: state.trees.slice(0, removeFromIndex)
  }
}

const removeFocusId = (state) => ({
  ...state,
  focusId: ''
})

const removeNextBookmarkTrees = (
  state,
  {payload}: ActionType<typeof bookmarkCreators.removeNextBookmarkTrees>
) => {
  const removeAfterIndex = state.trees.findIndex(R.pathEq(['parent', 'id'], payload.removeAfterId))
  if (removeAfterIndex < 0) return state

  return {
    ...state,
    trees: state.trees.slice(0, removeAfterIndex + 1)
  }
}

const resetClipboard = (state) => ({
  ...state,
  clipboard: INITIAL_STATE.clipboard
})

const setBookmarkTrees = (
  state,
  {payload}: ActionType<typeof bookmarkCreators.setBookmarkTrees>
) => ({
  ...state,
  trees: payload.bookmarkTrees
})

const setFocusId = (state, {payload}: ActionType<typeof bookmarkCreators.setFocusId>) => ({
  ...state,
  focusId: payload.focusId
})

export const bookmarkReducer = handleActions(
  {
    [bookmarkTypes.COPY_BOOKMARK]: copyBookmark,
    [bookmarkTypes.CUT_BOOKMARK]: cutBookmark,
    [bookmarkTypes.GET_SEARCH_RESULT]: getSearchResult,
    [bookmarkTypes.REMOVE_BOOKMARK_TREE]: removeBookmarkTree,
    [bookmarkTypes.REMOVE_FOCUS_ID]: removeFocusId,
    [bookmarkTypes.REMOVE_NEXT_BOOKMARK_TREES]: removeNextBookmarkTrees,
    [bookmarkTypes.RESET_CLIPBOARD]: resetClipboard,
    [bookmarkTypes.SET_BOOKMARK_TREES]: setBookmarkTrees,
    [bookmarkTypes.SET_FOCUS_ID]: setFocusId
  },
  INITIAL_STATE
)
