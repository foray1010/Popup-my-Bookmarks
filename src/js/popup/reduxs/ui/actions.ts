import {createAction} from 'typesafe-actions'

export const setIsFocusSearchInput = createAction(
  'SET_IS_FOCUS_SEARCH_INPUT',
  (action) => (isFocusSearchInput: boolean) => action({isFocusSearchInput})
)
