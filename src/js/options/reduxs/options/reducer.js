import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import {optionsTypes} from './actions'

const INITIAL_STATE = Immutable({})
export const optionsReducer = createReducer(INITIAL_STATE, {
  [optionsTypes.UPDATE_OPTIONS]: (state, {options}) => Immutable(options),
  [optionsTypes.UPDATE_SINGLE_OPTION]: (state, {optionName, optionValue}) =>
    Immutable.set(state, optionName, optionValue)
})
