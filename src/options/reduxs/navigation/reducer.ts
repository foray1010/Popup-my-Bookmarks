import {ActionType, createReducer} from 'typesafe-actions'

import {NAV_MODULE} from '../../constants'
import * as navigationCreators from './actions'

interface NavigationState {
  selectedNavModule: NAV_MODULE
}
const INITIAL_STATE: NavigationState = {
  selectedNavModule: NAV_MODULE.GENERAL
}

export const navigationReducer = createReducer<
  NavigationState,
  ActionType<typeof navigationCreators>
>(INITIAL_STATE).handleAction(navigationCreators.switchNavModule, (state, {payload}) => {
  return {
    ...state,
    selectedNavModule: payload.navModule
  }
})
