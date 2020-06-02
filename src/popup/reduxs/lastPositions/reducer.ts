import type { LastPosition } from '../../types/localStorage'

type lastPositionsState = Array<LastPosition>
const INITIAL_STATE: lastPositionsState = []

export const lastPositionsReducer = (
  state: lastPositionsState = INITIAL_STATE,
): lastPositionsState => state
