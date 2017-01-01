/* @flow */

import {combineReducers} from 'redux'
import {static as Immutable} from 'seamless-immutable'

import {
  SELECT_NAV_MODULE,
  UPDATE_OPTIONS,
  UPDATE_SINGLE_OPTION
} from '../constants'

const rootReducer: Function = combineReducers({
  options(
    state: Object = Immutable({}),
    action: Object
  ): Object {
    switch (action.type) {
      case UPDATE_OPTIONS:
        return action.payload

      case UPDATE_SINGLE_OPTION:
        return Immutable.set(
          state,
          action.payload.optionName,
          action.payload.optionValue
        )

      default:
        return state
    }
  },

  optionsConfig(
    state: Object = Immutable({})
  ): Object {
    return state
  },

  selectedNavModule(
    state: ?string = null,
    action: Object
  ): ?string {
    switch (action.type) {
      case SELECT_NAV_MODULE:
        return action.payload

      default:
        return state
    }
  }
})

export default rootReducer
