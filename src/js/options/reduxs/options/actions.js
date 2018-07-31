// @flow strict

import {createAction} from 'redux-actions'

export const optionsTypes = {
  RELOAD_OPTIONS: 'RELOAD_OPTIONS',
  RESET_TO_DEFAULT_OPTIONS: 'RESET_TO_DEFAULT_OPTIONS',
  SAVE_OPTIONS: 'SAVE_OPTIONS',
  UPDATE_OPTIONS: 'UPDATE_OPTIONS',
  UPDATE_SINGLE_OPTION: 'UPDATE_SINGLE_OPTION'
}

const reloadOptions = createAction(optionsTypes.RELOAD_OPTIONS)

const resetToDefaultOptions = createAction(optionsTypes.RESET_TO_DEFAULT_OPTIONS)

const saveOptions = createAction(optionsTypes.SAVE_OPTIONS)

const updateOptions = createAction(optionsTypes.UPDATE_OPTIONS, (options: Object) => ({options}))

const updateSingleOption = createAction(
  optionsTypes.UPDATE_SINGLE_OPTION,
  (optionName: string, optionValue: any) => ({optionName, optionValue})
)

export const optionsCreators = {
  reloadOptions,
  resetToDefaultOptions,
  saveOptions,
  updateOptions,
  updateSingleOption
}
