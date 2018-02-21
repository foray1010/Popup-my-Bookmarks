// @flow

import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import {optionsTypes} from './actions'

const INITIAL_STATE = Immutable({})

const updateOptions = (state, {options}) => Immutable(options)

const updateSingleOption = (state, {optionName, optionValue}) =>
  Immutable.set(state, optionName, optionValue)

export const optionsReducer = createReducer(INITIAL_STATE, {
  [optionsTypes.UPDATE_OPTIONS]: updateOptions,
  [optionsTypes.UPDATE_SINGLE_OPTION]: updateSingleOption
})
