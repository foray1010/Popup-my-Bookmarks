import {ActionType, getType} from 'typesafe-actions'

import {NAV_MODULE} from '../../constants'
import * as navigationCreators from './actions'

interface NavigationState {
  selectedNavModule: NAV_MODULE
}
const INITIAL_STATE: NavigationState = {
  selectedNavModule: NAV_MODULE.GENERAL
}

export const navigationReducer = (
  state: NavigationState = INITIAL_STATE,
  action: ActionType<typeof navigationCreators>
): NavigationState => {
  switch (action.type) {
    case getType(navigationCreators.switchNavModule):
      return {
        ...state,
        selectedNavModule: action.payload.navModule
      }

    default:
      return state
  }
}
