import Immutable from 'seamless-immutable'
import {combineReducers} from 'redux'

import {SELECT_NAV_MODULE, UPDATE_OPTIONS, UPDATE_SINGLE_OPTION} from '../constants'

const rootReducer = combineReducers({
  options(state = Immutable({}), action) {
    switch (action.type) {
      case UPDATE_OPTIONS:
        return action.payload

      case UPDATE_SINGLE_OPTION:
        return Immutable.set(state, action.payload.optionName, action.payload.optionValue)

      default:
        return state
    }
  },

  optionsConfig(state = Immutable({})) {
    return state
  },

  selectedNavModule(state = null, action) {
    switch (action.type) {
      case SELECT_NAV_MODULE:
        return action.payload

      default:
        return state
    }
  }
})

export default rootReducer
