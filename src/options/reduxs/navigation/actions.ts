import { createAction } from 'typesafe-actions'

import { NAV_MODULE } from '../../constants'

export const switchNavModule = createAction(
  'SWITCH_NAV_MODULE',
  action => (navModule: NAV_MODULE) =>
    action({
      navModule,
    }),
)
