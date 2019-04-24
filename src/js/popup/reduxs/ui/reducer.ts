import {ActionType, createReducer} from 'typesafe-actions'

import * as uiCreators from './actions'

interface UiState {
  isFocusSearchInput: boolean
}
const INITIAL_STATE: UiState = {
  isFocusSearchInput: false
}

export const uiReducer = createReducer<UiState, ActionType<typeof uiCreators>>(
  INITIAL_STATE
).handleAction(uiCreators.setIsFocusSearchInput, (state, {payload}) => {
  return {
    ...state,
    isFocusSearchInput: payload.isFocusSearchInput
  }
})
