// @flow strict

import {handleActions} from 'redux-actions'
import type {ActionType} from 'redux-actions'

import {optionsCreators, optionsTypes} from './actions'

const INITIAL_STATE = {}

const updateOptions = (state, {payload}: ActionType<typeof optionsCreators.updateOptions>) =>
  payload.options

const updateSingleOption = (
  state,
  {payload}: ActionType<typeof optionsCreators.updateSingleOption>
) => ({
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
