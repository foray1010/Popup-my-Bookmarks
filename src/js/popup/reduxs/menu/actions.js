// @flow

import {createActions} from 'reduxsauce'

export const {Creators: menuCreators, Types: menuTypes} = createActions({
  openMenu: ['targetId', 'positionLeft', 'positionTop']
})
