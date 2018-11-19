// @flow strict

import {handleActions} from 'redux-actions'
import type {ActionType} from 'redux-actions'

import {optionsCreators, optionsTypes} from './actions'

type State = Object
const INITIAL_STATE: State = {}

const updateOptions = (
  state: State,
  {payload}: ActionType<typeof optionsCreators.updateOptions>
): State => payload.options

const updateSingleOption = (
  state: State,
  {payload}: ActionType<typeof optionsCreators.updateSingleOption>
): State => ({
  ...state,
  [payload.optionName]: payload.optionValue
})

export const optionsReducer = handleActions(
  {
    [optionsTypes.UPDATE_OPTIONS]: updateOptions,
    [optionsTypes.UPDATE_SINGLE_OPTION]: updateSingleOption
  },
  INITIAL_STATE
)
