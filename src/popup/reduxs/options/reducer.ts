import {Options} from '../../../core/types/options'

type OptionsState = Partial<Options>
const INITIAL_STATE: OptionsState = {}

export const optionsReducer = (state: OptionsState = INITIAL_STATE): OptionsState => state
