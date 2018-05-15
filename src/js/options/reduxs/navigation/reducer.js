// @flow strict

import {handleActions} from 'redux-actions'
import type {ActionType} from 'redux-actions'

import {NAV_MODULE_GENERAL} from '../../constants'
import {navigationCreators, navigationTypes} from './actions'

const INITIAL_STATE = {
  selectedNavModule: NAV_MODULE_GENERAL
}

const switchNavModule = (
  state,
  {payload}: ActionType<typeof navigationCreators.switchNavModule>
) => ({
  ...state,
  selectedNavModule: payload.navModule
})

export const navigationReducer = handleActions(
  {
    [navigationTypes.SWITCH_NAV_MODULE]: switchNavModule
  },
  INITIAL_STATE
)
