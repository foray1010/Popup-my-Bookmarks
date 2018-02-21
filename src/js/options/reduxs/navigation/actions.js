// @flow

import {createActions} from 'reduxsauce'

export const {Creators: navigationCreators, Types: navigationTypes} = createActions({
  switchNavModule: ['navModule']
})
