import { ActionType, createReducer } from 'typesafe-actions'

import { Options } from '../../../core/types/options'
import * as optionsCreators from './actions'

type OptionsState = Partial<Options>
const INITIAL_STATE: OptionsState = {}

export const optionsReducer = createReducer<
  OptionsState,
  ActionType<typeof optionsCreators>
>(INITIAL_STATE)
  .handleAction(
    optionsCreators.updateOptions,
    (_, { payload }) => payload.options,
  )
  .handleAction(optionsCreators.updatePartialOptions, (state, { payload }) => {
    return {
      ...state,
      ...payload,
    }
  })
