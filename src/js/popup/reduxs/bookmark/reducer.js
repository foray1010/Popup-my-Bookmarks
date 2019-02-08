// @flow strict

import * as R from 'ramda'
import {handleActions} from 'redux-actions'
import type {ActionType} from 'redux-actions'

import * as CST from '../../constants'
import type {BookmarkTree} from '../../types'
import {bookmarkCreators, bookmarkTypes} from './actions'
import {simulateBookmark} from './utils/converters'

type State = {|
  clipboard: {|
    id: string,
    isRemoveAfterPaste: boolean
  |},
  focusId: string,
  searchKeyword: string,
  trees: Array<BookmarkTree>
|}
const INITIAL_STATE: State = {
  clipboard: {
    id: '',
    isRemoveAfterPaste: false
  },
  focusId: '',
  searchKeyword: '',
  trees: []
}

const copyBookmark = (
  state: State,
  {payload}: ActionType<typeof bookmarkCreators.copyBookmark>
): State => ({
  ...state,
  clipboard: {
    id: payload.id,
    isRemoveAfterPaste: false
  }
})

const cutBookmark = (
  state: State,
  {payload}: ActionType<typeof bookmarkCreators.cutBookmark>
): State => ({
  ...state,
  clipboard: {
    id: payload.id,
    isRemoveAfterPaste: true
  }
})

const getSearchResult = (
  state: State,
  {payload}: ActionType<typeof bookmarkCreators.getSearchResult>
): State => ({
  ...state,
  searchKeyword: payload.searchKeyword
})

const removeBookmarkTree = (
  state: State,
  {payload}: ActionType<typeof bookmarkCreators.removeBookmarkTree>
): State => {
  const removeFromIndex = state.trees.findIndex(R.pathEq(['parent', 'id'], payload.id))
  if (removeFromIndex < 0) return state

  return {
    ...state,
    trees: state.trees.slice(0, removeFromIndex)
  }
}

const removeDragIndicator = (state: State): State => ({
  ...state,
  trees: state.trees.map((tree) => ({
    ...tree,
    children: tree.children.filter((child) => child.type !== CST.TYPE_DRAG_INDICATOR)
  }))
})

const removeFocusId = (state: State): State => ({
  ...state,
  focusId: ''
})

const removeNextBookmarkTrees = (
  state: State,
  {payload}: ActionType<typeof bookmarkCreators.removeNextBookmarkTrees>
): State => {
  const removeAfterIndex = state.trees.findIndex(R.pathEq(['parent', 'id'], payload.removeAfterId))
  if (removeAfterIndex < 0) return state

  return {
    ...state,
    trees: state.trees.slice(0, removeAfterIndex + 1)
  }
}

const resetClipboard = (state: State): State => ({
  ...state,
  clipboard: INITIAL_STATE.clipboard
})

const setBookmarkTrees = (
  state: State,
  {payload}: ActionType<typeof bookmarkCreators.setBookmarkTrees>
): State => ({
  ...state,
  trees: payload.bookmarkTrees
})

const setDragIndicator = (
  state: State,
  {payload}: ActionType<typeof bookmarkCreators.setDragIndicator>
): State => {
  const parentIndex = state.trees.findIndex((tree) => tree.parent.id === payload.parentId)
  if (parentIndex === -1) return state

  return R.compose(
    R.over(
      R.lensPath(['trees', parentIndex, 'children']),
      R.insert(payload.index, simulateBookmark({type: CST.TYPE_DRAG_INDICATOR}))
    ),
    removeDragIndicator
  )(state)
}

const setFocusId = (
  state: State,
  {payload}: ActionType<typeof bookmarkCreators.setFocusId>
): State => ({
  ...state,
  focusId: payload.focusId
})

export const bookmarkReducer = handleActions(
  {
    [bookmarkTypes.COPY_BOOKMARK]: copyBookmark,
    [bookmarkTypes.CUT_BOOKMARK]: cutBookmark,
    [bookmarkTypes.GET_SEARCH_RESULT]: getSearchResult,
    [bookmarkTypes.REMOVE_BOOKMARK_TREE]: removeBookmarkTree,
    [bookmarkTypes.REMOVE_DRAG_INDICATOR]: removeDragIndicator,
    [bookmarkTypes.REMOVE_FOCUS_ID]: removeFocusId,
    [bookmarkTypes.REMOVE_NEXT_BOOKMARK_TREES]: removeNextBookmarkTrees,
    [bookmarkTypes.RESET_CLIPBOARD]: resetClipboard,
    [bookmarkTypes.SET_BOOKMARK_TREES]: setBookmarkTrees,
    [bookmarkTypes.SET_DRAG_INDICATOR]: setDragIndicator,
    [bookmarkTypes.SET_FOCUS_ID]: setFocusId
  },
  INITIAL_STATE
)
