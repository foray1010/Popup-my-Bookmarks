import {LocalStorage} from '../../types/localStorage'

type LocalStorageState = LocalStorage
const INITIAL_STATE: LocalStorageState = {}

export const localStorageReducer = (state: LocalStorageState = INITIAL_STATE): LocalStorageState =>
  state
