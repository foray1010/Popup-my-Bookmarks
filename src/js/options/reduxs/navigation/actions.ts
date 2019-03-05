import {createAction} from 'typesafe-actions'

export const switchNavModule = createAction('SWITCH_NAV_MODULE', (action) => (navModule: string) =>
  action({
    navModule
  }))
