import Immutable from 'seamless-immutable'
import {createActions, createReducer} from 'reduxsauce'

export const {Types, Creators} = createActions({
  reloadOptions: null,
  resetToDefaultOptions: null,
  saveOptions: null,
  updateOptions: ['options'],
  updateSingleOption: ['optionName', 'optionValue']
})

const INITIAL_STATE = Immutable({})
export default createReducer(INITIAL_STATE, {
  [Types.UPDATE_OPTIONS]: (state, {options}) => Immutable(options),
  [Types.UPDATE_SINGLE_OPTION]: (state, {optionName, optionValue}) =>
    Immutable.set(state, optionName, optionValue)
})
