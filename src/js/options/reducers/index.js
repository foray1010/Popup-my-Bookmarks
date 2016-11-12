import {combineReducers} from 'redux'
import Immutable from 'seamless-immutable'

import {
  SELECT_NAV_MODULE,
  UPDATE_OPTIONS,
  UPDATE_SINGLE_OPTION
} from '../constants'

const rootReducer = combineReducers({
  options(state = Immutable({}), action) {
    switch (action.type) {
      case UPDATE_OPTIONS:
        return action.options

      case UPDATE_SINGLE_OPTION: {
        const mutableOptions = state.asMutable()

        mutableOptions[action.optionName] = action.optionValue

        return Immutable(mutableOptions)
      }

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
        return action.navModule

      default:
        return state
    }
  }
})

export default rootReducer
