// @flow strict

import {handleActions} from 'redux-actions'
import type {ActionType} from 'redux-actions'

import {uiCreators, uiTypes} from './actions'

type State = {|
  isDisableGlobalKeyboardEvent: boolean,
  isFocusSearchInput: boolean
|}
const INITIAL_STATE: State = {
  isDisableGlobalKeyboardEvent: false,
  isFocusSearchInput: false
}

const setIsDisableGlobalKeyboardEvent = (
  state: State,
  {payload}: ActionType<typeof uiCreators.setIsDisableGlobalKeyboardEvent>
): State => ({
  ...state,
  isDisableGlobalKeyboardEvent: payload.isDisableGlobalKeyboardEvent
})

const setIsFocusSearchInput = (
  state: State,
  {payload}: ActionType<typeof uiCreators.setIsFocusSearchInput>
): State => ({
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
