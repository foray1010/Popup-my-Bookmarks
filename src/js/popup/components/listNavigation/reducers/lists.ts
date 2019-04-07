import {ActionType, createAction, getType} from 'typesafe-actions'

import deleteFromMap from '../../../utils/deleteFromMap'
import {ListNavigationContextType, initialLists} from '../ListNavigationContext'

export const listsCreators = {
  removeList: createAction('REMOVE_LIST', (action) => (listIndex: number) => action({listIndex})),
  resetLists: createAction('RESET_LISTS'),
  setHighlightedIndex: createAction(
    'SET_HIGHLIGHTED_INDEX',
    (action) => (listIndex: number, itemIndex: number) => action({listIndex, itemIndex})
  ),
  setItemCount: createAction(
    'SET_LIST_ITEM_COUNT',
    (action) => (listIndex: number, itemCount: number) => action({listIndex, itemCount})
  ),
  unsetHighlightedIndex: createAction(
    'UNSET_HIGHLIGHTED_INDEX',
    (action) => (listIndex: number, itemIndex: number) => action({listIndex, itemIndex})
  )
}

export const listsReducer = (
  state: ListNavigationContextType['lists'],
  action: ActionType<typeof listsCreators>
): ListNavigationContextType['lists'] => {
  switch (action.type) {
    case getType(listsCreators.removeList): {
      const {listIndex} = action.payload

      return {
        ...state,
        highlightedIndices: deleteFromMap(state.highlightedIndices, listIndex),
        itemCounts: deleteFromMap(state.itemCounts, listIndex)
      }
    }

    case getType(listsCreators.resetLists):
      return initialLists

    case getType(listsCreators.setHighlightedIndex): {
      const {listIndex, itemIndex} = action.payload

      return {
        ...state,
        highlightedIndices: new Map(state.highlightedIndices).set(listIndex, itemIndex)
      }
    }

    case getType(listsCreators.setItemCount): {
      const {listIndex, itemCount} = action.payload

      return {...state, itemCounts: new Map(state.itemCounts).set(listIndex, itemCount)}
    }

    case getType(listsCreators.unsetHighlightedIndex): {
      const {listIndex, itemIndex} = action.payload

      if (state.highlightedIndices.get(listIndex) !== itemIndex) {
        return state
      }

      return {
        ...state,
        highlightedIndices: deleteFromMap(state.highlightedIndices, listIndex)
      }
    }

    default:
      return state
  }
}
