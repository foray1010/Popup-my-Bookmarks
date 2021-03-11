import * as R from 'ramda'
import { ActionType, createReducer, getType } from 'typesafe-actions'

import * as CST from '../../constants'
import type { BookmarkTree } from '../../types'
import * as bookmarkCreators from './actions'
import { simulateBookmark } from './utils/converters'

interface BookmarkState {
  clipboard: {
    id?: string
    isRemoveAfterPaste: boolean
  }
  searchKeyword: string
  trees: Array<BookmarkTree>
}
const INITIAL_STATE: BookmarkState = {
  clipboard: {
    id: undefined,
    isRemoveAfterPaste: false,
  },
  searchKeyword: '',
  trees: [],
}

const removeDragIndicator = (state: BookmarkState): BookmarkState => ({
  ...state,
  trees: state.trees.map((tree) => ({
    ...tree,
    children: tree.children.filter(
      (child) => child.type !== CST.BOOKMARK_TYPES.DRAG_INDICATOR,
    ),
  })),
})

export const bookmarkReducer = createReducer<
  BookmarkState,
  ActionType<typeof bookmarkCreators>
>(INITIAL_STATE, {
  [getType(bookmarkCreators.copyBookmark)](
    state: BookmarkState,
    { payload }: ReturnType<typeof bookmarkCreators.copyBookmark>,
  ) {
    return {
      ...state,
      clipboard: {
        id: payload.id,
        isRemoveAfterPaste: false,
      },
    }
  },
  [getType(bookmarkCreators.cutBookmark)](
    state: BookmarkState,
    { payload }: ReturnType<typeof bookmarkCreators.cutBookmark>,
  ) {
    return {
      ...state,
      clipboard: {
        id: payload.id,
        isRemoveAfterPaste: true,
      },
    }
  },
  [getType(bookmarkCreators.getSearchResult)](
    state: BookmarkState,
    { payload }: ReturnType<typeof bookmarkCreators.getSearchResult>,
  ) {
    return {
      ...state,
      searchKeyword: payload.searchKeyword,
    }
  },
  [getType(bookmarkCreators.removeBookmarkTree)](
    state: BookmarkState,
    { payload }: ReturnType<typeof bookmarkCreators.removeBookmarkTree>,
  ) {
    const removeFromIndex = state.trees.findIndex(
      (tree) => tree.parent.id === payload.id,
    )
    if (removeFromIndex < 0) return state

    return {
      ...state,
      trees: state.trees.slice(0, removeFromIndex),
    }
  },
  [getType(bookmarkCreators.removeDragIndicator)]: removeDragIndicator,
  [getType(bookmarkCreators.removeNextBookmarkTrees)](
    state: BookmarkState,
    { payload }: ReturnType<typeof bookmarkCreators.removeNextBookmarkTrees>,
  ) {
    const removeAfterIndex = state.trees.findIndex(
      (tree) => tree.parent.id === payload.removeAfterId,
    )
    if (removeAfterIndex < 0) return state

    return {
      ...state,
      trees: state.trees.slice(0, removeAfterIndex + 1),
    }
  },
  [getType(bookmarkCreators.resetClipboard)](state: BookmarkState) {
    return {
      ...state,
      clipboard: INITIAL_STATE.clipboard,
    }
  },
  [getType(bookmarkCreators.setBookmarkTrees)](
    state: BookmarkState,
    { payload }: ReturnType<typeof bookmarkCreators.setBookmarkTrees>,
  ) {
    return {
      ...state,
      trees: payload.bookmarkTrees,
    }
  },
  [getType(bookmarkCreators.setDragIndicator)](
    state: BookmarkState,
    { payload }: ReturnType<typeof bookmarkCreators.setDragIndicator>,
  ) {
    const parentIndex = state.trees.findIndex(
      (tree) => tree.parent.id === payload.parentId,
    )
    if (parentIndex === -1) return state

    return R.over(
      R.lensPath(['trees', parentIndex, 'children']),
      R.insert(
        payload.index,
        simulateBookmark({ type: CST.BOOKMARK_TYPES.DRAG_INDICATOR }),
      ),
      removeDragIndicator(state),
    )
  },
})
