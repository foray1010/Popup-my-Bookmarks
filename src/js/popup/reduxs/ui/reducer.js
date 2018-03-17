// @flow

import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import {uiTypes} from './actions'

type UiState = {|
  isFocusSearchInput: boolean
|}

const INITIAL_STATE: UiState = Immutable({
  isFocusSearchInput: false
})

type SetIsFocusSearchInputPayload = {|
  isFocusSearchInput: boolean
|}
const setIsFocusSearchInput = (
  state: UiState,
  {isFocusSearchInput}: SetIsFocusSearchInputPayload
) => Immutable.merge(state, {isFocusSearchInput})

export const uiReducer = createReducer(INITIAL_STATE, {
  [uiTypes.SET_IS_FOCUS_SEARCH_INPUT]: setIsFocusSearchInput
})
