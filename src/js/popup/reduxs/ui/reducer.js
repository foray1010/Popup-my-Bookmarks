// @flow strict

import {handleActions} from 'redux-actions'
import type {ActionType} from 'redux-actions'

import {uiCreators, uiTypes} from './actions'

const INITIAL_STATE = {
  isDisableGlobalKeyboardEvent: false,
  isFocusSearchInput: false
}

const setIsDisableGlobalKeyboardEvent = (
  state,
  {payload}: ActionType<typeof uiCreators.setIsDisableGlobalKeyboardEvent>
) => ({
  ...state,
  isDisableGlobalKeyboardEvent: payload.isDisableGlobalKeyboardEvent
})

const setIsFocusSearchInput = (
  state,
  {payload}: ActionType<typeof uiCreators.setIsFocusSearchInput>
) => ({
  ...state,
  isFocusSearchInput: payload.isFocusSearchInput
})

export const uiReducer = handleActions(
  {
    [uiTypes.SET_IS_DISABLE_GLOBAL_KEYBOARD_EVENT]: setIsDisableGlobalKeyboardEvent,
    [uiTypes.SET_IS_FOCUS_SEARCH_INPUT]: setIsFocusSearchInput
  },
  INITIAL_STATE
)
