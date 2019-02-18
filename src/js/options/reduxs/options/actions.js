// @flow strict

import {createAction} from 'redux-actions'

import type {Options} from '../../../common/types/options'

export const optionsTypes = {
  RELOAD_OPTIONS: 'RELOAD_OPTIONS',
  RESET_TO_DEFAULT_OPTIONS: 'RESET_TO_DEFAULT_OPTIONS',
  SAVE_OPTIONS: 'SAVE_OPTIONS',
  UPDATE_OPTIONS: 'UPDATE_OPTIONS',
  UPDATE_PARTIAL_OPTIONS: 'UPDATE_PARTIAL_OPTIONS'
}

const reloadOptions = createAction(optionsTypes.RELOAD_OPTIONS)

const resetToDefaultOptions = createAction(optionsTypes.RESET_TO_DEFAULT_OPTIONS)

const saveOptions = createAction(optionsTypes.SAVE_OPTIONS)

const updateOptions = createAction(optionsTypes.UPDATE_OPTIONS, (options: Options) => ({
  options
}))

const updatePartialOptions = createAction(
  optionsTypes.UPDATE_PARTIAL_OPTIONS,
  (partialOptions: $Shape<Options>) => partialOptions
)

export const optionsCreators = {
  reloadOptions,
  resetToDefaultOptions,
  saveOptions,
  updateOptions,
  updatePartialOptions
}
