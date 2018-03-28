// @flow

import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import {uiTypes} from './actions'

type UiState = {|
  isDisableGlobalKeyboardEvent: boolean,
  isFocusSearchInput: boolean
|}

const INITIAL_STATE: UiState = Immutable({
  isDisableGlobalKeyboardEvent: false,
  isFocusSearchInput: false
})

type SetIsDisableGlobalKeyboardEventPayload = {|
  isDisableGlobalKeyboardEvent: boolean
|}
const setIsDisableGlobalKeyboardEvent = (
  state: UiState,
  {isDisableGlobalKeyboardEvent}: SetIsDisableGlobalKeyboardEventPayload
) => Immutable.merge(state, {isDisableGlobalKeyboardEvent})

type SetIsFocusSearchInputPayload = {|
  isFocusSearchInput: boolean
|}
const setIsFocusSearchInput = (
  state: UiState,
  {isFocusSearchInput}: SetIsFocusSearchInputPayload
) => Immutable.merge(state, {isFocusSearchInput})

export const uiReducer = createReducer(INITIAL_STATE, {
  [uiTypes.SET_IS_DISABLE_GLOBAL_KEYBOARD_EVENT]: setIsDisableGlobalKeyboardEvent,
  [uiTypes.SET_IS_FOCUS_SEARCH_INPUT]: setIsFocusSearchInput
})
