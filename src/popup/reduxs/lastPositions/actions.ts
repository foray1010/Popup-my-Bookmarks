import { createAction } from 'typesafe-actions'

import type { LastPosition } from '../../types/localStorage'

export const createLastPosition = createAction(
  'CREATE_LAST_POSITION',
  (index: number, id: string) => ({ index, id }),
)()

export const removeLastPosition = createAction(
  'REMOVE_LAST_POSITION',
  (index: number) => ({ index }),
)()

export const updateLastPosition = createAction(
  'UPDATE_LAST_POSITION',
  (lastPosition: LastPosition) => lastPosition,
)()
