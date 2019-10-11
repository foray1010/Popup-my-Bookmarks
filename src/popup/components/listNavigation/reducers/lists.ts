import {
  ActionType,
  createAction,
  createReducer,
  getType,
} from 'typesafe-actions'

import deleteFromMap from '../../../utils/deleteFromMap'

export interface ListsState {
  highlightedIndices: Map<number, number>
  itemCounts: Map<number, number>
}

export const listsInitialState: ListsState = {
  highlightedIndices: new Map(),
  itemCounts: new Map(),
}

export const listsCreators = {
  removeList: createAction('REMOVE_LIST', action => (listIndex: number) =>
    action({ listIndex }),
  ),
  resetLists: createAction('RESET_LISTS'),
  setHighlightedIndex: createAction(
    'SET_HIGHLIGHTED_INDEX',
    action => (listIndex: number, itemIndex: number) =>
      action({ listIndex, itemIndex }),
  ),
  setItemCount: createAction(
    'SET_ITEM_COUNT',
    action => (listIndex: number, itemCount: number) =>
      action({ listIndex, itemCount }),
  ),
  unsetHighlightedIndex: createAction(
    'UNSET_HIGHLIGHTED_INDEX',
    action => (listIndex: number, itemIndex: number) =>
      action({ listIndex, itemIndex }),
  ),
}

export const listsReducer = createReducer<
  ListsState,
  ActionType<typeof listsCreators>
>(listsInitialState, {
  [getType(listsCreators.removeList)]: (
    state: ListsState,
    { payload }: ReturnType<typeof listsCreators.removeList>,
  ) => {
    const { listIndex } = payload

    return {
      ...state,
      highlightedIndices: deleteFromMap(state.highlightedIndices, listIndex),
      itemCounts: deleteFromMap(state.itemCounts, listIndex),
    }
  },
  [getType(listsCreators.resetLists)]: () => listsInitialState,
  [getType(listsCreators.setHighlightedIndex)]: (
    state: ListsState,
    { payload }: ReturnType<typeof listsCreators.setHighlightedIndex>,
  ) => {
    const { listIndex, itemIndex } = payload

    return {
      ...state,
      highlightedIndices: new Map(state.highlightedIndices).set(
        listIndex,
        itemIndex,
      ),
    }
  },
  [getType(listsCreators.setItemCount)]: (
    state: ListsState,
    { payload }: ReturnType<typeof listsCreators.setItemCount>,
  ) => {
    const { listIndex, itemCount } = payload

    return {
      ...state,
      itemCounts: new Map(state.itemCounts).set(listIndex, itemCount),
    }
  },
  [getType(listsCreators.unsetHighlightedIndex)]: (
    state: ListsState,
    { payload }: ReturnType<typeof listsCreators.unsetHighlightedIndex>,
  ) => {
    const { listIndex, itemIndex } = payload

    if (state.highlightedIndices.get(listIndex) !== itemIndex) {
      return state
    }

    return {
      ...state,
      highlightedIndices: deleteFromMap(state.highlightedIndices, listIndex),
    }
  },
})
