import {createAction} from 'typesafe-actions'

export const setIsDisableGlobalKeyboardEvent = createAction(
  'SET_IS_DISABLE_GLOBAL_KEYBOARD_EVENT',
  (action) => (isDisableGlobalKeyboardEvent: boolean) => action({isDisableGlobalKeyboardEvent})
)

export const setIsFocusSearchInput = createAction(
  'SET_IS_FOCUS_SEARCH_INPUT',
  (action) => (isFocusSearchInput: boolean) => action({isFocusSearchInput})
)
