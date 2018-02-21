// @flow

import {createActions} from 'reduxsauce'

export const {Creators: optionsCreators, Types: optionsTypes} = createActions({
  reloadOptions: null,
  resetToDefaultOptions: null,
  saveOptions: null,
  updateOptions: ['options'],
  updateSingleOption: ['optionName', 'optionValue']
})
