import {ActionType, getType} from 'typesafe-actions'

import * as uiCreators from './actions'

interface UiState {
  isDisableGlobalKeyboardEvent: boolean
  isFocusSearchInput: boolean
}
const INITIAL_STATE: UiState = {
  isDisableGlobalKeyboardEvent: false,
  isFocusSearchInput: false
}

export const uiReducer = (
  state: UiState = INITIAL_STATE,
  action: ActionType<typeof uiCreators>
): UiState => {
  switch (action.type) {
    case getType(uiCreators.setIsDisableGlobalKeyboardEvent):
      return {
        ...state,
        isDisableGlobalKeyboardEvent: action.payload.isDisableGlobalKeyboardEvent
      }

    case getType(uiCreators.setIsFocusSearchInput):
      return {
        ...state,
        isFocusSearchInput: action.payload.isFocusSearchInput
      }

    default:
      return state
  }
}
