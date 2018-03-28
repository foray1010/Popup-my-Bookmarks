// @flow

import {createActions} from 'reduxsauce'

export const {Creators: uiCreators, Types: uiTypes} = createActions({
  setIsDisableGlobalKeyboardEvent: ['isDisableGlobalKeyboardEvent'],
  setIsFocusSearchInput: ['isFocusSearchInput']
})
