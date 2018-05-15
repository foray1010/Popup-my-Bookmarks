// @flow strict

import {createAction} from 'redux-actions'

export const uiTypes = {
  SET_IS_DISABLE_GLOBAL_KEYBOARD_EVENT: 'SET_IS_DISABLE_GLOBAL_KEYBOARD_EVENT',
  SET_IS_FOCUS_SEARCH_INPUT: 'SET_IS_FOCUS_SEARCH_INPUT'
}

const setIsDisableGlobalKeyboardEvent = createAction(
  uiTypes.SET_IS_DISABLE_GLOBAL_KEYBOARD_EVENT,
  (isDisableGlobalKeyboardEvent: boolean) => ({isDisableGlobalKeyboardEvent})
)

const setIsFocusSearchInput = createAction(
  uiTypes.SET_IS_FOCUS_SEARCH_INPUT,
  (isFocusSearchInput: boolean) => ({isFocusSearchInput})
)

export const uiCreators = {
  setIsDisableGlobalKeyboardEvent,
  setIsFocusSearchInput
}
