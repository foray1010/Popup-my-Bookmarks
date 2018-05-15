// @flow strict

import {createAction} from 'redux-actions'

export const navigationTypes = {
  SWITCH_NAV_MODULE: 'SWITCH_NAV_MODULE'
}

const switchNavModule = createAction(navigationTypes.SWITCH_NAV_MODULE, (navModule: string) => ({
  navModule
}))

export const navigationCreators = {
  switchNavModule
}
