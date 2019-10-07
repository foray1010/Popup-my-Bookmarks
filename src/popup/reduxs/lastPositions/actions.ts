import {createAction} from 'typesafe-actions'

import {LastPosition} from '../../types/localStorage'

export const createLastPosition = createAction(
  'CREATE_LAST_POSITION',
  action => (index: number, id: string) => action({index, id})
)

export const removeLastPosition = createAction('REMOVE_LAST_POSITION', action => (index: number) =>
  action({index})
)

export const updateLastPosition = createAction(
  'UPDATE_LAST_POSITION',
  action => (lastPosition: LastPosition) => action(lastPosition)
)
