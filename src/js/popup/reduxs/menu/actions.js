// @flow

import {createActions} from 'reduxsauce'

export const {Creators: menuCreators, Types: menuTypes} = createActions({
  clickMenuRow: ['rowName'],
  closeMenu: null,
  openMenu: ['targetId', 'positionLeft', 'positionTop'],
  removeFocusedRow: null,
  setFocusedRow: ['focusedRow'],
  setMenuPattern: ['menuPattern']
})
