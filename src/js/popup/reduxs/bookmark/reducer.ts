import * as R from 'ramda'
import {ActionType, getType} from 'typesafe-actions'

import * as CST from '../../constants'
import {BookmarkTree} from '../../types'
import * as bookmarkCreators from './actions'
import {simulateBookmark} from './utils/converters'

interface BookmarkState {
  clipboard: {
    id: string
    isRemoveAfterPaste: boolean
  }
  searchKeyword: string
  trees: Array<BookmarkTree>
}
const INITIAL_STATE: BookmarkState = {
  clipboard: {
    id: '',
    isRemoveAfterPaste: false
  },
  searchKeyword: '',
  trees: []
}

const removeDragIndicator = (state: BookmarkState): BookmarkState => ({
  ...state,
  trees: state.trees.map((tree) => ({
    ...tree,
    children: tree.children.filter((child) => child.type !== CST.BOOKMARK_TYPES.DRAG_INDICATOR)
  }))
})

export const bookmarkReducer = (
  state: BookmarkState = INITIAL_STATE,
  action: ActionType<typeof bookmarkCreators>
): BookmarkState => {
  switch (action.type) {
    case getType(bookmarkCreators.copyBookmark):
      return {
        ...state,
        clipboard: {
          id: action.payload.id,
          isRemoveAfterPaste: false
        }
      }

    case getType(bookmarkCreators.cutBookmark):
      return {
        ...state,
        clipboard: {
          id: action.payload.id,
          isRemoveAfterPaste: true
        }
      }

    case getType(bookmarkCreators.getSearchResult):
      return {
        ...state,
        searchKeyword: action.payload.searchKeyword
      }

    case getType(bookmarkCreators.removeBookmarkTree): {
      const removeFromIndex = state.trees.findIndex(R.pathEq(['parent', 'id'], action.payload.id))
      if (removeFromIndex < 0) return state

      return {
        ...state,
        trees: state.trees.slice(0, removeFromIndex)
      }
    }

    case getType(bookmarkCreators.removeDragIndicator):
      return removeDragIndicator(state)

    case getType(bookmarkCreators.removeNextBookmarkTrees): {
      const removeAfterIndex = state.trees.findIndex(
        R.pathEq(['parent', 'id'], action.payload.removeAfterId)
      )
      if (removeAfterIndex < 0) return state

      return {
        ...state,
        trees: state.trees.slice(0, removeAfterIndex + 1)
      }
    }

    case getType(bookmarkCreators.resetClipboard):
      return {
        ...state,
        clipboard: INITIAL_STATE.clipboard
      }

    case getType(bookmarkCreators.setBookmarkTrees):
      return {
        ...state,
        trees: action.payload.bookmarkTrees
      }

    case getType(bookmarkCreators.setDragIndicator): {
      const parentIndex = state.trees.findIndex(
        (tree) => tree.parent.id === action.payload.parentId
      )
      if (parentIndex === -1) return state

      return R.over(
        R.lensPath(['trees', parentIndex, 'children']),
        R.insert(action.payload.index, simulateBookmark({type: CST.BOOKMARK_TYPES.DRAG_INDICATOR})),
        removeDragIndicator(state)
      )
    }

    default:
      return state
  }
}
