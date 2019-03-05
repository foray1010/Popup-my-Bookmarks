import {ActionType, getType} from 'typesafe-actions'

import {Options} from '../../../common/types/options'
import * as optionsCreators from './actions'

type OptionsState = Partial<Options>
const INITIAL_STATE: OptionsState = {}

export const optionsReducer = (
  state: OptionsState = INITIAL_STATE,
  action: ActionType<typeof optionsCreators>
): OptionsState => {
  switch (action.type) {
    case getType(optionsCreators.updateOptions):
      return action.payload.options

    case getType(optionsCreators.updatePartialOptions):
      return {
        ...state,
        ...action.payload
      }

    default:
      return state
  }
}
