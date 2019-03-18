import {createAction} from 'typesafe-actions'

import {LocalStorage} from '../../types/localStorage'

export const updateLocalStorage = createAction(
  'UPDATE_LOCAL_STORAGE',
  (action) => (data: LocalStorage) => action(data)
)
