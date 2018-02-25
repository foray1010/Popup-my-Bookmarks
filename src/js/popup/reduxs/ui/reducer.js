// @flow

import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import {uiTypes} from './actions'

const INITIAL_STATE = Immutable({
  isFocusSearchInput: false
})

type SetIsFocusSearchInputPayload = {|
  isFocusSearchInput: boolean
|}
const setIsFocusSearchInput = (state, {isFocusSearchInput}: SetIsFocusSearchInputPayload) =>
  Immutable.merge(state, {isFocusSearchInput})

export const uiReducer = createReducer(INITIAL_STATE, {
  [uiTypes.SET_IS_FOCUS_SEARCH_INPUT]: setIsFocusSearchInput
})
