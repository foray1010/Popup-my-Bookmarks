// @flow strict

import {handleActions} from 'redux-actions'
import type {ActionType} from 'redux-actions'

import type {Options} from '../../../common/types/options'
import {optionsCreators, optionsTypes} from './actions'

type State = $Shape<Options>
const INITIAL_STATE: State = {}

const updateOptions = (
  state: State,
  {payload}: ActionType<typeof optionsCreators.updateOptions>
): State => payload.options

const updatePartialOptions = (
  state: State,
  {payload}: ActionType<typeof optionsCreators.updatePartialOptions>
): State => ({
  ...state,
  ...payload
})

export const optionsReducer = handleActions(
  {
    [optionsTypes.UPDATE_OPTIONS]: updateOptions,
    [optionsTypes.UPDATE_PARTIAL_OPTIONS]: updatePartialOptions
  },
  INITIAL_STATE
)
