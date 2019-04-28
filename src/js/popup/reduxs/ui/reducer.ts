import {ActionType, createReducer} from 'typesafe-actions'

import * as uiCreators from './actions'

interface UiState {
  highlightedItemCoordinates: {
    positionLeft: number
    positionTop: number
  }
  isFocusSearchInput: boolean
}
const INITIAL_STATE: UiState = {
  highlightedItemCoordinates: {
    positionLeft: 0,
    positionTop: 0
  },
  isFocusSearchInput: false
}

export const uiReducer = createReducer<UiState, ActionType<typeof uiCreators>>(INITIAL_STATE)
  .handleAction(uiCreators.setHighlightedItemCoordinates, (state, {payload}) => {
    return {
      ...state,
      highlightedItemCoordinates: payload.highlightedItemCoordinates
    }
  })
  .handleAction(uiCreators.setIsFocusSearchInput, (state, {payload}) => {
    return {
      ...state,
      isFocusSearchInput: payload.isFocusSearchInput
    }
  })
