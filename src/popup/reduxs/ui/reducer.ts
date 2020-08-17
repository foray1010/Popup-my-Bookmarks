import type { ActionType } from 'typesafe-actions'
import { createReducer } from 'typesafe-actions'

import * as uiCreators from './actions'

interface UiState {
  highlightedItemCoordinates: {
    positionLeft: number
    positionTop: number
  }
}
const INITIAL_STATE: UiState = {
  highlightedItemCoordinates: {
    positionLeft: 0,
    positionTop: 0,
  },
}

export const uiReducer = createReducer<UiState, ActionType<typeof uiCreators>>(
  INITIAL_STATE,
).handleAction(
  uiCreators.setHighlightedItemCoordinates,
  (state, { payload }) => {
    return {
      ...state,
      highlightedItemCoordinates: payload.highlightedItemCoordinates,
    }
  },
)
