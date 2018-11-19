// @flow strict

import {handleActions} from 'redux-actions'
import type {ActionType} from 'redux-actions'

import {NAV_MODULE_GENERAL} from '../../constants'
import {navigationCreators, navigationTypes} from './actions'

type State = {|
  selectedNavModule: string
|}
const INITIAL_STATE: State = {
  selectedNavModule: NAV_MODULE_GENERAL
}

const switchNavModule = (
  state: State,
  {payload}: ActionType<typeof navigationCreators.switchNavModule>
): State => ({
  ...state,
  selectedNavModule: payload.navModule
})

export const navigationReducer = handleActions(
  {
    [navigationTypes.SWITCH_NAV_MODULE]: switchNavModule
  },
  INITIAL_STATE
)
